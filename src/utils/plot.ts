import { promisify } from "util";
import { exec } from "child_process";
import {
	Curve,
	GeneralSettings,
	PlotOptions2D,
	PlotOptions3D,
	ScalarFields2D,
	ScalarFields3D,
	Settings,
	Surface,
} from "../types/plot";

const mathematicaOptionsParser: {
	[key in
		| keyof PlotOptions3D
		| keyof Omit<GeneralSettings, "dimensions" | "type">]: (
		value: string
	) => string;
} = {
	plotLabel: (value: string) => `PlotLabel -> ${value}`,
	clippingStyle: (value: string) => `ClippingStyle -> ${value}`,
	filling: (value: string) => `Filling -> ${value}`,
	fillingStyle: (value: string) => `FillingStyle -> ${value}`,
	plotStyle: (value: string) => `PlotStyle -> ${value}`,
	boxed: (value: string) => `Boxed -> ${value}`,
	boundaryStyle: (value: string) => `BoundaryStyle -> ${value}`,
	axes: (value: string) => `Axes -> ${value}`,
	axesLabel: (value: string) => `AxesLabel -> ${value}`,
	frame: (value: string) => `Frame -> ${value}`,
	frameLabel: (value: string) => `FrameLabel -> ${value}`,
};

const parseOptions = (
	options: Partial<PlotOptions3D | PlotOptions2D | GeneralSettings>
) => {
	return Object.entries(options)
		.filter((opt) => opt[1])
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
	curve2D: (curve: Curve) => {
		const { components, t } = curve;
		const options = parseOptions(curve.options);
		return `ParametricPlot2D[{${components.join()}}, {t, ${t.min}, ${
			t.max
		}}, ${options}]`;
	},
	curve3D: (curve: Curve) => {
		const { components, t } = curve;
		const options = parseOptions(curve.options);
		return `ParametricPlot3D[{${components.join()}}, {t, ${t.min}, ${
			t.max
		}}, ${options}]`;
	},
	scalarField2D: (scalarField: ScalarFields2D) => {
		const { expression, plotRange } = scalarField;
		const options = parseOptions(scalarField.options);
		return `Plot[${expression}, {x, ${plotRange.x.min}, ${plotRange.x.max}}, ${options}]`;
	},
	scalarField3D: (scalarField: ScalarFields3D) => {
		const { expression, plotRange } = scalarField;
		const options = parseOptions(scalarField.options);
		return `Plot3D[${expression}, PlotRange -> {{${plotRange.x.min}, ${plotRange.x.max}}, {${plotRange.y.min}, ${plotRange.y.max}}, {${plotRange.z.min}, ${plotRange.z.max}}}, ${options}]`;
	},
};

const rasterizeParser = (code: string, settings: Settings) => {
	const generalOptions = parseOptions(settings.general);
	return `Rasterize[Show[${code}, ${generalOptions}], ImageSize -> {${
		settings.raster?.dimensions?.width || 250
	}, ${settings.raster?.dimensions?.height || 200}}, Background -> ${
		settings.raster.background
	}]`;
};

const mathematicaParser2D = (settings: Settings) => {
	const scalarFields2D =
		settings.scalarFields2D?.map((fn) =>
			mathematicaPlotParser.scalarField2D(fn)
		) || [];

	const curves =
		settings.curves2D?.map((fn) => mathematicaPlotParser.curve2D(fn)) || [];

	return rasterizeParser([...curves, ...scalarFields2D].join(), settings);
};

const mathematicaParser3D = (settings: Settings) => {
	const scalarFields3D =
		settings.scalarFields3D.map((fn) =>
			mathematicaPlotParser.scalarField3D(fn)
		) || [];
	const curves =
		settings.curves3D.map((fn) => mathematicaPlotParser.curve3D(fn)) || [];
	const surfaces =
		settings.surfaces.map((fn) => mathematicaPlotParser.surface(fn)) || [];

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
export const parseCodeBlock = (
	code: string
): { error: string; code: string } => {
	try {
		const settings: Settings = JSON.parse(code);
		let parsedCode = "";
		if (settings.raster.type == "2D")
			parsedCode = mathematicaParser2D(settings);
		if (settings.raster.type == "3D")
			parsedCode = mathematicaParser3D(settings);

		return { code: parsedCode.replace(/\s/g, ""), error: "" };
	} catch (err) {
		return { error: err.message, code: "" };
	}
};

export const buildBase64URL = (base64: string, format: string) =>
	`data:image/${format};base64,${base64}`;
