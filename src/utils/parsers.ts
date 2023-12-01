import {
	ParametricPlot2D,
	GeneralSettings,
	Graph2DTypes,
	Graph3DTypes,
	Options2D,
	Options3D,
	Plot2D,
	Plot3D,
	PlotSettings,
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
		const {
			components,
			domain: { u },
		} = curve;
		const options = parseOptions(opts);
		return `ParametricPlot[{${components.join()}}, {u, ${u.min}, ${
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
		const {
			components,
			domain: { u, v },
		} = surface;
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

const rasterizeParser = (code: string, settings: PlotSettings) => {
	const generalOptions = parseOptions(settings.general);
	return `Rasterize[Show[${code} ${generalOptions}], ImageSize -> {${
		settings.raster?.dimensions?.width || 250
	}, ${settings.raster?.dimensions?.height || "Automatic"}}, Background -> ${
		settings.raster.background
	}, AspectRatio -> Automatic]`;
};

export const mathematicaParser2D = (settings: PlotSettings) => {
	const parse2D = (type: Graph2DTypes) =>
		settings.graphs
			.filter((graph) => graph.type === type)
			.map((graph) =>
				mathematicaPlotParser2D[type](graph, graph.options)
			) || [];

	return rasterizeParser(
		[...parse2D("plot"), ...parse2D("parametricPlot")].join(),
		settings
	);
};

export const mathematicaParser3D = (settings: PlotSettings) => {
	const parse3D = (type: Graph3DTypes) =>
		settings.graphs
			.filter((graph) => graph.type === type)
			.map((graph) =>
				mathematicaPlotParser3D[type](graph, graph.options)
			) || [];

	return rasterizeParser(
		[...parse3D("plot"), ...parse3D("parametricPlot")].join(),
		settings
	);
};
