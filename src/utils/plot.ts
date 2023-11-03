import { promisify } from "util";
import { exec } from "child_process";
import {
	Curve,
	PlotOptions2D,
	PlotOptions3D,
	ScalarFields2D,
	ScalarFields3D,
	Settings,
	Surface,
} from "../types/plot";

const mathematicaOptionsParser: {
	[key in keyof PlotOptions3D]: (value: string) => string;
} = {
	plotLabel: (value: string) => `PlotLabel -> ${value}`,
	clippingStyle: (value: string) => `ClippingStyle -> ${value}`,
	filling: (value: string) => `Filling -> ${value}`,
	fillingStyle: (value: string) => `FillingStyle -> ${value}`,
	plotStyle: (value: string) => `PlotStyle -> ${value}`,
	boxed: (value: string) => `Boxed -> ${value}`,
	boundaryStyle: (value: string) => `BoundaryStyle -> ${value}`,
};

const parseOptions = (options: PlotOptions3D | PlotOptions2D) => {
	return Object.entries(options)
		.map((opt: [keyof PlotOptions3D, string]) =>
			mathematicaOptionsParser[opt[0]](opt[1])
		)
		.join();
};

const mathematicaPlotParser = {
	surface: (surface: Surface) => {
		const { components, u, v } = surface;
		const options = parseOptions(surface.options);
		return `ParametricPlot3D[{${components.join()}}, {u, ${u.min}, ${
			u.max
		}}, {v, ${v.min}, ${v.max}}, ${options}]`;
	},
	curve: (curve: Curve) => {
		const { components, t } = curve;
		const options = parseOptions(curve.options);
		return `ParametricPlot2D[{${components.join()}}, {t, ${t.min}, ${
			t.max
		}}, ${options}]`;
	},
	scalarField2D: (scalarField: ScalarFields2D) => {
		const { expression, plotRange } = scalarField;
		const options = parseOptions(scalarField.options);
		return `Plot2D[${expression}, PlotRange -> {{${plotRange.x.min}, ${plotRange.x.max}}, {${plotRange.y.min}, ${plotRange.y.max}}}, ${options}]`;
	},
	scalarField3D: (scalarField: ScalarFields3D) => {
		const { expression, plotRange } = scalarField;
		const options = parseOptions(scalarField.options);
		return `Plot3D[${expression}, PlotRange -> {{${plotRange.x.min}, ${plotRange.x.max}}, {${plotRange.y.min}, ${plotRange.y.max}}, {${plotRange.z.min}, ${plotRange.z.max}}}, ${options}]`;
	},
};

const rasterizeParser = (code: string, settings: Settings) => {
	return `Rasterize[Show[${code}], Background -> ${settings.background}, ImageSize -> {${settings.dimensions.width}, ${settings.dimensions.height}}]`;
};

const mathematicaParser2D = (settings: Settings) => {
	const scalarFields2D = settings.scalarFields2D.map((fn) =>
		mathematicaPlotParser.scalarField2D(fn)
	);
	const curves = settings.curves.map((fn) => mathematicaPlotParser.curve(fn));

	return rasterizeParser([...curves, ...scalarFields2D].join(), settings);
};

const mathematicaParser3D = (settings: Settings) => {
	const scalarFields3D = settings.scalarFields3D.map((fn) =>
		mathematicaPlotParser.scalarField3D(fn)
	);
	const curves = settings.curves.map((fn) => mathematicaPlotParser.curve(fn));
	const surfaces = settings.surfaces.map((fn) =>
		mathematicaPlotParser.surface(fn)
	);

	return rasterizeParser(
		[...curves, ...surfaces, ...scalarFields3D].join(),
		settings
	);
};

export const getBase64Plot = async (
	plot: string
): Promise<{ error: string; base64: string }> => {
	const { stdout, stderr } = await promisify(exec)(
		`wolframscript --code 'ExportString[${plot}, {"Base64", "PNG"}]'`
	);
	if (stderr || stdout.contains("Invalid"))
		return { error: stderr || stdout, base64: "" };
	return { error: "", base64: stdout };
};

// Parses the JSON (codeblock) to Wolfram Mathematica
export const parseCodeBlock = (code: string) => {
	const settings: Settings = JSON.parse(code);
	let parsedCode = "";
	if (settings.type == "2D") parsedCode = mathematicaParser2D(settings);
	if (settings.type == "3D") parsedCode = mathematicaParser3D(settings);

	return parsedCode.replace(/\s/g, "");
};

export const buildBase64URL = (base64: string, format: string) =>
	`data:image/${format};base64,${base64}`;
