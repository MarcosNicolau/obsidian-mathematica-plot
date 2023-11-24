import {
	Curve,
	GeneralSettings,
	Graph2DTypes,
	Graph3DTypes,
	PlotOptions2D,
	PlotOptions3D,
	ScalarFields2D,
	ScalarFields3D,
	Settings,
	Surface,
} from "../types/plot";

const parseTrueFalse = (value: any) => (value ? "True" : "False");

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
	boxed: (value: string) => `Boxed -> ${parseTrueFalse(value)}`,
	boundaryStyle: (value: string) => `BoundaryStyle -> ${value}`,
	axes: (value: string) => `Axes -> ${parseTrueFalse(value)}`,
	axesLabel: (value: string) => `AxesLabel -> ${value}`,
	frame: (value: string) => `Frame -> ${parseTrueFalse(value)}`,
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

const mathematicaPlotParser2D = {
	curve: (curve: Curve) => {
		const { components, t } = curve;
		const options = parseOptions(curve.options);
		return `ParametricPlot2D[{${components.join()}}, {t, ${t.min}, ${
			t.max
		}}, ${options}]`;
	},
	scalarField: (scalarField: ScalarFields2D) => {
		const { expression, plotRange } = scalarField;
		const options = parseOptions(scalarField.options);
		return `Plot[${expression}, {x, ${plotRange.x.min}, ${plotRange.x.max}}, ${options}]`;
	},
};

const mathematicaPlotParser3D = {
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
		return `ParametricPlot3D[{${components.join()}}, {t, ${t.min}, ${
			t.max
		}}, ${options}]`;
	},
	scalarField: (scalarField: ScalarFields3D) => {
		const { expression, plotRange } = scalarField;
		const options = parseOptions(scalarField.options);
		return `Plot3D[${expression}, PlotRange -> {{${plotRange.x.min}, ${plotRange.x.max}}, {${plotRange.y?.min}, ${plotRange.y?.max}}, {${plotRange.z.min}, ${plotRange.z.max}}}, ${options}]`;
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

export const mathematicaParser2D = (settings: Settings) => {
	const parse2D = (type: Graph2DTypes) =>
		settings.graphs.dim2
			.filter((graph) => graph.type === type && graph[type])
			.map((graph) =>
				//@ts-expect-error we are making sure that scalar fields exists in the filter
				mathematicaPlotParser2D[type](graph[type])
			) || [];

	return rasterizeParser(
		[...parse2D("curve"), ...parse2D("scalarField")].join(),
		settings
	);
};

export const mathematicaParser3D = (settings: Settings) => {
	const parse3D = (type: Graph3DTypes) =>
		settings.graphs.dim3
			.filter((graph) => graph.type === type && graph[type])
			.map((graph) =>
				//@ts-expect-error same as above
				mathematicaPlotParser3D[type](graph[type])
			) || [];

	return rasterizeParser(
		[
			...parse3D("curve"),
			...parse3D("scalarField"),
			...parse3D("surface"),
		].join(),
		settings
	);
};
