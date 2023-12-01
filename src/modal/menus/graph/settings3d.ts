import { Setting } from "obsidian";
import { Graph3D, ParametricPlot3D, Plot3D, RegionPlot3D } from "types/plot";
import {
	OptionsFields,
	renderIntervalForm,
	renderOptions,
} from "modal/menus/graph/helpers";

export const defaultGraph = (
	id: string
): Graph3D & Plot3D & ParametricPlot3D & RegionPlot3D => ({
	id,
	type: "plot",
	expression: "",
	plotRange: { x: { min: "", max: "" }, y: { min: "", max: "" } },
	options: {},
	components: [],
	domain: {
		u: { min: "", max: "" },
		v: { min: "", max: "" },
		x: { min: "", max: "" },
		y: { min: "", max: "" },
		z: { min: "", max: "" },
	},
});

export const renderPlotSettings = (el: HTMLElement, graph: Plot3D) => {
	new Setting(el.createDiv())
		.setName("f(x, y) = ")
		.setDesc("You can also provide a list of functions {f1, f2, ...}")
		.addTextArea((component) =>
			component.setValue(graph.expression).onChange((value) => {
				graph.expression = value;
			})
		);

	renderIntervalForm(el, "x", graph.plotRange.x);
	renderIntervalForm(el, "y", graph.plotRange.y);
};

export const renderParametricPlotSettings = (
	el: HTMLElement,
	graph: ParametricPlot3D
) => {
	new Setting(el.createDiv()).setName("g1(u, v) =").addTextArea((component) =>
		component.setValue(graph.components[0]).onChange((value) => {
			graph.components[0] = value;
		})
	);
	new Setting(el.createDiv()).setName("g2(u, v) =").addTextArea((component) =>
		component.setValue(graph.components[1]).onChange((value) => {
			graph.components[1] = value;
		})
	);
	new Setting(el.createDiv()).setName("g3(u, v) =").addTextArea((component) =>
		component.setValue(graph.components[2]).onChange((value) => {
			graph.components[2] = value;
		})
	);
	renderIntervalForm(el, "u", graph.domain.u);
	renderIntervalForm(el, "v", graph.domain.v);
};

export const renderRegionPlotSettings = (
	el: HTMLElement,
	graph: RegionPlot3D
) => {
	new Setting(el.createDiv())
		.setName("expression (x,y,z)")
		.setDesc("You can also provide a list of expressions {e1, e2, ...}")
		.addTextArea((component) =>
			component.setValue(graph.expression).onChange((value) => {
				graph.expression = value;
			})
		);
	renderIntervalForm(el, "x", graph.domain.x);
	renderIntervalForm(el, "y", graph.domain.y);
	renderIntervalForm(el, "z", graph.domain.z);
};

const optsFields: OptionsFields = {
	plotLabels: "Plot Labels",
	plotLegends: "Plot Legends",
	plotStyle: "Plot Style",
	filling: "Filling",
	fillingStyle: "Filling Style",
	boundaryStyle: "Boundary Style",
};

export const renders3D = {
	defaultGraph,
	renderPlotSettings,
	renderParametricPlotSettings,
	renderRegionPlotSettings,
	renderOptions: renderOptions(optsFields),
};
