import { OptionsFields, renderOptions } from "modal/menus/graph/helpers";
import { Setting } from "obsidian";
import { Graph2D, ParametricPlot2D, Plot2D } from "types/plot";

export const defaultGraph = (id: string): Graph2D => ({
	type: "plot",
	id,
	parametricPlot: {
		components: [],
		u: { max: "", min: "" },
	},
	plot: {
		expression: "",
		plotRange: { x: { min: "", max: "" } },
	},
	options: {},
});

export const renderPlotSettings = (el: HTMLElement, plot: Plot2D) => {
	new Setting(el.createDiv())
		.setName("f(x) = ")
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
};

export const renderParametricPlotSettings = (
	el: HTMLElement,
	parametricPlot: ParametricPlot2D
) => {
	new Setting(el.createDiv()).setName("g1(t) = ").addTextArea((component) =>
		component.setValue(parametricPlot.components[0]).onChange((value) => {
			parametricPlot.components[0] = value;
		})
	);
	new Setting(el.createDiv()).setName("g2(t) = ").addTextArea((component) =>
		component.setValue(parametricPlot.components[1]).onChange((value) => {
			parametricPlot.components[1] = value;
		})
	);
	new Setting(el.createDiv()).setName("t min").addText((component) =>
		component.setValue(parametricPlot.u.min).onChange((value) => {
			parametricPlot.u.min = value;
		})
	);
	new Setting(el.createDiv()).setName("t max").addText((component) =>
		component.setValue(parametricPlot.u.max).onChange((value) => {
			parametricPlot.u.max = value;
		})
	);
};

const optsFields: OptionsFields = {
	plotLabels: "Plot Labels",
	plotLegends: "Plot Legends",
	plotStyle: "Plot Style",
	filling: "Filling",
	fillingStyle: "Filling Style",
};

export const renders2D = {
	defaultGraph,
	renderParametricPlotSettings,
	renderOptions: renderOptions(optsFields),
	renderPlotSettings,
};
