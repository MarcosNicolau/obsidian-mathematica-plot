export type Interval = {
	min: string;
	max: string;
};

export type PlotRange3D = Required<PlotRange2D> & {
	z?: Interval;
};

export type PlotRange2D = {
	x: Interval;
	y?: Interval;
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

export type ParametricPlot2D = {
	components: string[];
	t: Interval;
};

export type ParametricPlot3D = {
	components: string[];
	u: Interval;
	options: Partial<Options3D>;
	v?: Interval;
};

export type Plot2D = {
	expression: string;
	plotRange: PlotRange2D;
};

export type Plot3D = {
	expression: string;
	plotRange: PlotRange3D;
};

export type GeneralSettings = {
	axes: string;
	axesLabel?: string;
	frame: boolean;
	frameLabel?: string;
	boxed?: boolean;
	plotLabel?: string;
};

export type Graph2DTypes = "plot" | "parametricPlot";
export type Graph3DTypes = Graph2DTypes;

export type Graph2D = {
	type: Graph2DTypes;
	id: string;
	parametricPlot?: ParametricPlot2D;
	plot?: Plot2D;
	options: Partial<Options2D>;
};

export type Graph3D = {
	type: Graph3DTypes;
	id: string;
	plot?: Plot3D;
	parametricPlot?: ParametricPlot3D;
	options: Partial<Options3D>;
};

export type Graphs = {
	dim2: Graph2D[];
	dim3: Graph3D[];
};

export type RasterizeSettings = {
	type: "2D" | "3D";
	background: string;
	dimensions: {
		height: string;
		width: string;
	};
};

export type Settings = {
	raster: RasterizeSettings;
	general: GeneralSettings;
	graphs: Graphs;
};
