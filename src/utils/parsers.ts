import {
	ParametricPlot2D,
	GeneralSettings,
	Graph2DTypes,
	Graph3DTypes,
	Options2D,
	Options3D,
	Plot2D,
	Plot3D,
	Settings,
	ParametricPlot3D,
} from "../types/plot";

export const parseTrueFalse = (value: any) => (value ? "True" : "False");

const mathematicaOptionsParser: {
	[key in
		| keyof Options3D
		| keyof Omit<GeneralSettings, "dimensions" | "type">]: (
		value: string
	) => string;
} = {
	plotLabels: (value: string) => `PlotLabels -> ${value}`,
	plotStyle: (value: string) => `PlotStyle -> ${value}`,
	filling: (value: string) => `Filling -> ${value}`,
	fillingStyle: (value: string) => `FillingStyle -> ${value}`,
	boxed: (value: string) => `Boxed -> ${value}`,
	boundaryStyle: (value: string) => `BoundaryStyle -> ${value}`,
	axes: (value: string) => `Axes -> ${value}`,
	axesLabel: (value: string) => `AxesLabel -> ${value}`,
	frame: (value: string) => `Frame -> ${value}`,
	frameLabel: (value: string) => `FrameLabel -> ${value}`,
	plotLegends: (value: string) => `PlotLegends -> ${value}`,
	plotLabel: (value: string) => `PlotLabel -> ${value}`,
	others: (value: string) => value,
};

const parseOptions = (
	options: Partial<Options3D | Options2D | GeneralSettings>
) => {
	const opts = Object.entries(options)
		.filter((opt) => opt[1])
		.map((opt: [keyof Options3D, string]) =>
			mathematicaOptionsParser[opt[0]](opt[1])
		)
		.join();
	if (!opts) return "";
	else return `,${opts}`;
};

const mathematicaPlotParser2D = {
	parametricPlot: (curve: ParametricPlot2D, opts: Options2D) => {
		const { components, u } = curve;
		const options = parseOptions(opts);
		return `ParametricPlot[{${components.join()}}, {t, ${u.min}, ${
			u.max
		}} ${options}]`;
	},
	plot: (scalarField: Plot2D, opts: Options2D) => {
		const { expression, plotRange } = scalarField;
		const options = parseOptions(opts);
		return `Plot[${expression}, {x, ${plotRange.x.min}, ${plotRange.x.max}} ${options}]`;
	},
};

const mathematicaPlotParser3D = {
	parametricPlot: (surface: ParametricPlot3D, opts: Options3D) => {
		const { components, u, v } = surface;
		const options = parseOptions(opts);
		const base = (v: string) =>
			`ParametricPlot3D[{${components.join()}}, {u, ${u.min}, ${
				u.max
			}} ${v} ${options}]`;
		if (v.min && v.max) return base(`, {v, ${v.min}, ${v.max}}`);
		return base("");
	},
	plot: (scalarField: Plot3D, opts: Options3D) => {
		const { expression, plotRange } = scalarField;
		const options = parseOptions(opts);
		return `Plot3D[${expression}, {x, ${plotRange.x.min}, ${plotRange.x.max}}, {y, ${plotRange.y.min}, ${plotRange.y.max}} ${options}]`;
	},
};

const rasterizeParser = (code: string, settings: Settings) => {
	const generalOptions = parseOptions(settings.general);
	return `Rasterize[Show[${code} ${generalOptions}], ImageSize -> {${
		settings.raster?.dimensions?.width || 250
	}, ${settings.raster?.dimensions?.height || 200}}, Background -> ${
		settings.raster.background
	}, AspectRatio -> Automatic]`;
};

export const mathematicaParser2D = (settings: Settings) => {
	const parse2D = (type: Graph2DTypes) =>
		settings.graphs.dim2
			.filter((graph) => graph.type === type)
			.map((graph) =>
				//@ts-expect-error we are making sure that graph type exists in the filter
				mathematicaPlotParser2D[type](graph[type], graph.options)
			) || [];

	return rasterizeParser(
		[...parse2D("plot"), ...parse2D("parametricPlot")].join(),
		settings
	);
};

export const mathematicaParser3D = (settings: Settings) => {
	const parse3D = (type: Graph3DTypes) =>
		settings.graphs.dim3
			.filter((graph) => graph.type === type)
			.map((graph) =>
				//@ts-expect-error same as above
				mathematicaPlotParser3D[type](graph[type], graph.options)
			) || [];

	return rasterizeParser(
		[...parse3D("plot"), ...parse3D("parametricPlot")].join(),
		settings
	);
};
