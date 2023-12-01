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

export type RegionPlot2D = {
	expression: string;
	domain: {
		x: Interval;
		y: Interval;
	};
};

export type RegionPlot3D = {
	expression: string;
	domain: {
		x: Interval;
		y: Interval;
		z: Interval;
	};
};

export type ParametricPlot2D = {
	components: string[];
	domain: {
		u: Interval;
	};
};

export type ParametricPlot3D = {
	components: string[];
	domain: {
		u: Interval;
		v: Interval;
	};
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
	frame: string;
	frameLabel?: string;
	boxed?: string;
	plotLabel?: string;
};

export type GraphTypes = "plot" | "parametricPlot" | "regionPlot";

export type BuildGraph<
	Type extends GraphTypes,
	PlotType,
	Options = Options2D
> = PlotType & {
	id: string;
	type: Type;
	options: Partial<Options>;
};

export type Graph2D =
	| BuildGraph<"plot", Plot2D>
	| BuildGraph<"parametricPlot", ParametricPlot2D>
	| BuildGraph<"regionPlot", RegionPlot2D>;

export type Graph3D =
	| BuildGraph<"plot", Plot3D, Options3D>
	| BuildGraph<"parametricPlot", ParametricPlot3D, Options3D>
	| BuildGraph<"regionPlot", RegionPlot3D, Options3D>;

// 1. Maybe it would be better  to have two separate fields that divide each type of graph, so the types would be easier  to handle
// 2. But we take this approach to make it more readable to the user when it gets converted to yaml.
// Though we could take the 1 approach for code readability and simplicity (less typing gymnastics)
// and then change the structure when copying it to the editor for reason 2. Which would then require to take that structure and cast it back again to this one.
// But that would be too much work :).
export type Graphs = Graph2D[] | Graph3D[];

export type RasterizeSettings = {
	type: "2D" | "3D";
	background: string;
	dimensions: {
		height: string;
		width: string;
	};
};

export type PlotSettings = {
	raster: RasterizeSettings;
	general: GeneralSettings;
	graphs: Graphs;
};
