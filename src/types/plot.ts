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

export type VectorPlot = {
	components: string[];
	domain: {
		x: Interval;
		y: Interval;
		z: Interval;
	};
};

export type ContourPlot = {
	expression: string;
	domain: {
		x: Interval;
		y: Interval;
		z: Interval;
	};
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

export type GraphTypes =
	| "plot"
	| "parametricPlot"
	| "regionPlot"
	| "contourPlot"
	| "vectorPlot";

export type PlotType = {
	plot: Plot;
	parametricPlot: ParametricPlot;
	regionPlot: RegionPlot;
	contourPlot: ContourPlot;
	vectorPlot: VectorPlot;
};

export type Graph = {
	id: string;
	type: GraphTypes;
	options: Partial<Options3D>;
	//This is to ensure all the keys in GraphTypes are in PlotType
} & { [key in GraphTypes]: PlotType[key] };

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
