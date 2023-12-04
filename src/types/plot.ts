export type Interval = {
	min: string;
	max: string;
};

export type PlotRange = {
	x: Interval;
	y: Interval;
	z?: Interval;
};

export type Options2D = {
	plotStyle: string;
	plotLabels: string;
	plotLegends: string;
	filling: string;
	fillingStyle: string;
	others: string;
};

export type Options3D = Options2D & {
	boundaryStyle: string;
};

export type RegionPlot = {
	expression: string;
	domain: {
		x: Interval;
		y: Interval;
		z: Interval;
	};
};

export type ParametricPlot = {
	components: string[];
	domain: {
		u: Interval;
		v: Interval;
	};
};

export type Plot = {
	expression: string;
	plotRange: PlotRange;
};

export type GraphTypes = "plot" | "parametricPlot" | "regionPlot";

export type PlotType = {
	plot: Plot;
	parametricPlot: ParametricPlot;
	regionPlot: RegionPlot;
};

export type Graph = {
	id: string;
	type: GraphTypes;
	options: Partial<Options3D>;
} & PlotType;

export type Graphs = Graph[];

export type GeneralSettings = {
	axes: string;
	axesLabel?: string;
	frame: string;
	frameLabel?: string;
	boxed?: string;
	plotLabel?: string;
};

export type Dimensions = "2D" | "3D";

export type RasterizeSettings = {
	dim: Dimensions;
	background: string;
	size: {
		height: string;
		width: string;
	};
};

export type PlotSettings = {
	raster: RasterizeSettings;
	general: GeneralSettings;
	graphs: Graphs;
};
