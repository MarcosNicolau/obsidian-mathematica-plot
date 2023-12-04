import {
	GeneralSettings,
	Options2D,
	Options3D,
	Plot,
	PlotSettings,
	ParametricPlot,
	GraphTypes,
	RegionPlot,
} from "../types/plot";

export const parseTrueFalse = (value: any) => (value ? "True" : "False");

const mathematicaOptionsParser: {
	[key in keyof Options3D | keyof GeneralSettings]: (value: string) => string;
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

type Parsers = {
	[key in GraphTypes]: Function;
};

const mathematicaPlotParser2D: Parsers = {
	parametricPlot: (parametricPlot: ParametricPlot, opts: Options2D) => {
		const {
			components,
			domain: { u },
		} = parametricPlot;
		const options = parseOptions(opts);
		return `ParametricPlot[{${components.join()}}, {u, ${u.min}, ${
			u.max
		}} ${options}]`;
	},
	plot: (plot: Plot, opts: Options2D) => {
		const { expression, plotRange } = plot;
		const options = parseOptions(opts);
		return `Plot[${expression}, {x, ${plotRange.x.min}, ${plotRange.x.max}} ${options}]`;
	},
	regionPlot: (regionPlot: RegionPlot, opts: Options2D) => {
		const {
			expression,
			domain: { x, y },
		} = regionPlot;
		const options = parseOptions(opts);
		return `RegionPlot[${expression}, {x, ${x.min}, ${x.max}}, {y, ${y.min}, ${y.max}} ${options}]`;
	},
};

const mathematicaPlotParser3D: Parsers = {
	parametricPlot: (parametricPlot: ParametricPlot, opts: Options3D) => {
		const {
			components,
			domain: { u, v },
		} = parametricPlot;
		const options = parseOptions(opts);
		const base = (v: string) =>
			`ParametricPlot3D[{${components.join()}}, {u, ${u.min}, ${
				u.max
			}} ${v} ${options}]`;
		if (v.min && v.max) return base(`, {v, ${v.min}, ${v.max}}`);
		return base("");
	},
	plot: (plot: Plot, opts: Options3D) => {
		const { expression, plotRange } = plot;
		const options = parseOptions(opts);
		return `Plot3D[${expression}, {x, ${plotRange.x.min}, ${plotRange.x.max}}, {y, ${plotRange.y.min}, ${plotRange.y.max}} ${options}]`;
	},
	regionPlot: (regionPlot: RegionPlot, opts: Options3D) => {
		const {
			expression,
			domain: { x, y, z },
		} = regionPlot;
		const options = parseOptions(opts);
		return `RegionPlot3D[${expression}, {x, ${x.min}, ${x.max}}, {y, ${y.min}, ${y.max}}, {z, ${z.min}, ${z.max}} ${options}]`;
	},
};

const rasterizeParser = (code: string, settings: PlotSettings) => {
	const generalOptions = parseOptions(settings.general);
	return `Rasterize[Show[${code} ${generalOptions}], ImageSize -> {${
		settings.raster?.size?.width || 250
	}, ${settings.raster?.size?.height || "Automatic"}}, Background -> ${
		settings.raster.background
	}, AspectRatio -> Automatic]`;
};

export const mathematicaParser2D = (settings: PlotSettings) => {
	const parsedGraphs = settings.graphs.map((graph) =>
		mathematicaPlotParser2D[graph.type](graph[graph.type], graph.options)
	);
	return rasterizeParser(parsedGraphs.join(), settings);
};

export const mathematicaParser3D = (settings: PlotSettings) => {
	const parsedGraphs = settings.graphs.map((graph) =>
		mathematicaPlotParser3D[graph.type](graph[graph.type], graph.options)
	);
	return rasterizeParser(parsedGraphs.join(), settings);
};
