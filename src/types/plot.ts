export type Interval = {
	min: string;
	max: string;
};

export type PlotRange3D = PlotRange2D & {
	z: Interval;
};

export type PlotRange2D = {
	x: Interval;
	y?: Interval;
};

export type PlotOptions2D = {
	plotLabel: string;
	clippingStyle: string;
	filling: string;
	fillingStyle: string;
	plotStyle: string;
};

export type PlotOptions3D = PlotOptions2D & {
	boundaryStyle: string;
};

export type Curve = {
	components: string[];
	t: Interval;
	options: Partial<PlotOptions3D>;
};

export type Surface = {
	components: string[];
	u: Interval;
	options: Partial<PlotOptions3D>;
	v: Interval;
};

export type ScalarFields2D = {
	expression: string;
	plotRange: PlotRange2D;
	options: Partial<PlotOptions2D>;
};

export type ScalarFields3D = {
	expression: string;
	plotRange: PlotRange3D;
	options: Partial<PlotOptions3D>;
};

export type AxesLabel = {
	x: string;
	y: string;
	z: string;
};

export type GeneralSettings = {
	axes: boolean;
	axesLabel?: AxesLabel;
	frame: boolean;
	frameLabel?: string;
	boxed?: boolean;
};

export type Graph2DTypes = "curve" | "scalarField";
export type Graph3DTypes = Graph2DTypes | "surface";

export type Graphs = {
	dim2: {
		type: Graph2DTypes;
		curve?: Curve;
		scalarField?: ScalarFields2D;
	}[];
	dim3: {
		type: Graph3DTypes;
		scalarField?: ScalarFields3D;
		surface?: Surface;
		curve?: Curve;
	}[];
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
