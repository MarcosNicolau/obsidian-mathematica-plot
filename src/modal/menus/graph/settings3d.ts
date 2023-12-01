import { Setting } from "obsidian";
import { Graph3D, ParametricPlot3D, Plot3D } from "types/plot";
import { OptionsFields, renderOptions } from "modal/menus/graph/helpers";

export const defaultGraph = (
	id: string
): Graph3D & Plot3D & ParametricPlot3D => ({
	id,
	type: "plot",
	expression: "",
	plotRange: { x: { min: "", max: "" }, y: { min: "", max: "" } },
	options: {},
	components: [],
	domain: { u: { min: "", max: "" }, v: { min: "", max: "" } },
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
	new Setting(el.createDiv()).setName("x min").addText((component) =>
		component.setValue(graph.plotRange.x.min).onChange((value) => {
			graph.plotRange.x.min = value;
		})
	);
	new Setting(el.createDiv()).setName("x max").addText((component) =>
		component.setValue(graph.plotRange.x.max).onChange((value) => {
			graph.plotRange.x.max = value;
		})
	);
	new Setting(el.createDiv()).setName("y min").addText((component) =>
		component.setValue(graph.plotRange.y.min).onChange((value) => {
			graph.plotRange.y.min = value;
		})
	);
	new Setting(el.createDiv()).setName("y max").addText((component) =>
		component.setValue(graph.plotRange.y.max).onChange((value) => {
			graph.plotRange.y.max = value;
		})
	);
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
	new Setting(el.createDiv()).setName("u min").addText((component) =>
		component.setValue(graph.domain.u.min).onChange((value) => {
			graph.domain.u.min = value;
		})
	);
	new Setting(el.createDiv()).setName("u max").addText((component) =>
		component.setValue(graph.domain.u.max).onChange((value) => {
			graph.domain.u.max = value;
		})
	);
	new Setting(el.createDiv()).setName("v min").addText((component) =>
		component.setValue(graph.domain.v.min).onChange((value) => {
			graph.domain.v.min = value;
		})
	);
	new Setting(el.createDiv()).setName("v max").addText((component) =>
		component.setValue(graph.domain.v.max).onChange((value) => {
			graph.domain.v.max = value;
		})
	);
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
	renderParametricPlotSettings,
	renderOptions: renderOptions(optsFields),
	renderPlotSettings,
};
