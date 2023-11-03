export type Interval = {
	min: string;
	max: string;
};

export type PlotRange3D = PlotRange2D & {
	z: Interval;
};

export type PlotRange2D = {
	x: Interval;
	y: Interval;
};

export type PlotOptions2D = {
	plotLabel: string;
	clippingStyle: string;
	filling: string;
	fillingStyle: string;
	plotStyle: string;
};

export type PlotOptions3D = PlotOptions2D & {
	boxed: boolean;
	boundaryStyle: string;
};

export type Curve = {
	components: string[];
	t: Interval;
	options: PlotOptions3D;
};

export type Surface = {
	components: string[];
	u: Interval;
	options: PlotOptions3D;
	v: Interval;
};

export type ScalarFields2D = {
	expression: string;
	plotRange: PlotRange2D;
	options: PlotOptions2D;
};

export type ScalarFields3D = {
	expression: string;
	plotRange: PlotRange3D;
	options: PlotOptions3D;
};

export type AxesLabel = {
	x: string;
	y: string;
	z: string;
};

export type Settings = {
	type: "2D" | "3D";
	surfaces: Surface[];
	curves: Curve[];
	scalarFields3D: ScalarFields3D[];
	scalarFields2D: ScalarFields2D[];
	dimensions: {
		height: string;
		width: string;
	};
	axes: boolean;
	axesLabel: AxesLabel;
	frame: boolean;
	frameLabel: string;
	background: string;
};
