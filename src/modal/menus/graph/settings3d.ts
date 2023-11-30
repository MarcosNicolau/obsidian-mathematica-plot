import { Setting } from "obsidian";
import { Graph3D, ParametricPlot3D, Plot3D } from "types/plot";
import { OptionsFields, renderOptions } from "modal/menus/graph/helpers";

export const defaultGraph = (id: string): Graph3D => ({
	id,
	type: "plot",
	plot: {
		expression: "",
		plotRange: { x: { min: "", max: "" }, y: { min: "", max: "" } },
	},
	parametricPlot: {
		components: [],
		u: { min: "", max: "" },
		v: { min: "", max: "" },
	},
	options: {},
});

export const renderPlotSettings = (el: HTMLElement, plot: Plot3D) => {
	new Setting(el.createDiv())
		.setName("f(x, y) = ")
		.setDesc("You can also provide a list of functions {f1, f2, ...}")
		.addTextArea((component) =>
			component.setValue(plot.expression).onChange((value) => {
				plot.expression = value;
			})
		);
	new Setting(el.createDiv()).setName("x min").addText((component) =>
		component.setValue(plot.plotRange.x.min).onChange((value) => {
			plot.plotRange.x.min = value;
		})
	);
	new Setting(el.createDiv()).setName("x max").addText((component) =>
		component.setValue(plot.plotRange.x.max).onChange((value) => {
			plot.plotRange.x.max = value;
		})
	);
	new Setting(el.createDiv()).setName("y min").addText((component) =>
		component.setValue(plot.plotRange.y.min).onChange((value) => {
			plot.plotRange.y.min = value;
		})
	);
	new Setting(el.createDiv()).setName("y max").addText((component) =>
		component.setValue(plot.plotRange.y.max).onChange((value) => {
			plot.plotRange.y.max = value;
		})
	);
};

export const renderParametricPlotSettings = (
	el: HTMLElement,
	parametricPlot: ParametricPlot3D
) => {
	new Setting(el.createDiv()).setName("g1(u, v) =").addTextArea((component) =>
		component.setValue(parametricPlot.components[0]).onChange((value) => {
			parametricPlot.components[0] = value;
		})
	);
	new Setting(el.createDiv()).setName("g2(u, v) =").addTextArea((component) =>
		component.setValue(parametricPlot.components[1]).onChange((value) => {
			parametricPlot.components[1] = value;
		})
	);
	new Setting(el.createDiv()).setName("g3(u, v) =").addTextArea((component) =>
		component.setValue(parametricPlot.components[2]).onChange((value) => {
			parametricPlot.components[2] = value;
		})
	);
	new Setting(el.createDiv()).setName("u min").addText((component) =>
		component.setValue(parametricPlot.u.min).onChange((value) => {
			parametricPlot.u.min = value;
		})
	);
	new Setting(el.createDiv()).setName("u max").addText((component) =>
		component.setValue(parametricPlot.u.max).onChange((value) => {
			parametricPlot.u.max = value;
		})
	);
	new Setting(el.createDiv()).setName("v min").addText((component) =>
		component.setValue(parametricPlot.v.min).onChange((value) => {
			parametricPlot.v.min = value;
		})
	);
	new Setting(el.createDiv()).setName("v max").addText((component) =>
		component.setValue(parametricPlot.v.max).onChange((value) => {
			parametricPlot.v.max = value;
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
