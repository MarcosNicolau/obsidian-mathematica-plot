import { Setting } from "obsidian";
import {
	ContourPlot,
	ParametricPlot,
	Plot,
	RegionPlot,
	VectorPlot,
} from "types/plot";
import { OptionsFields, renderIntervalForm, renderOptions } from "./helpers";
import { RenderSettings } from "../graph";
import { optsFields2D } from "./settings2d";

export const renderPlotSettings = (el: HTMLElement, graph: Plot) => {
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
	graph: ParametricPlot
) => {
	const renderParametricCurveSettings = (el: HTMLElement) => {
		new Setting(el.createDiv())
			.setName("g1(u) =")
			.addTextArea((component) =>
				component.setValue(graph.components[0]).onChange((value) => {
					graph.components[0] = value;
				})
			);
		new Setting(el.createDiv())
			.setName("g2(u) =")
			.addTextArea((component) =>
				component.setValue(graph.components[1]).onChange((value) => {
					graph.components[1] = value;
				})
			);
		new Setting(el.createDiv())
			.setName("g3(u) =")
			.addTextArea((component) =>
				component.setValue(graph.components[2]).onChange((value) => {
					graph.components[2] = value;
				})
			);
		renderIntervalForm(el, "u", graph.domain.u);
	};

	const renderParametricSurfaceSettings = (el: HTMLElement) => {
		new Setting(el.createDiv())
			.setName("g1(u, v) =")
			.addTextArea((component) =>
				component.setValue(graph.components[0]).onChange((value) => {
					graph.components[0] = value;
				})
			);
		new Setting(el.createDiv())
			.setName("g2(u, v) =")
			.addTextArea((component) =>
				component.setValue(graph.components[1]).onChange((value) => {
					graph.components[1] = value;
				})
			);
		new Setting(el.createDiv())
			.setName("g3(u, v) =")
			.addTextArea((component) =>
				component.setValue(graph.components[2]).onChange((value) => {
					graph.components[2] = value;
				})
			);
		renderIntervalForm(el, "u", graph.domain.u);
		renderIntervalForm(el, "v", graph.domain.v);
	};

	new Setting(el.createDiv()).setName("Space").addDropdown((component) =>
		component
			.addOptions(<{ [key in ParametricPlot["type"]]: string }>{
				curve: "Curve",
				surface: "Surface",
			})
			.setValue(graph.type)
			.onChange((value: ParametricPlot["type"]) => {
				graph.type = value;
				renderSettings();
			})
	);

	const settingsEl = el.createDiv();

	const renderSettings = () => {
		settingsEl.innerHTML = "";
		if (graph.type === "curve") renderParametricCurveSettings(settingsEl);
		else renderParametricSurfaceSettings(settingsEl);
	};

	renderSettings();
};

export const renderRegionPlotSettings = (
	el: HTMLElement,
	graph: RegionPlot
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

export const renderContourPlotSettings = (
	el: HTMLElement,
	graph: ContourPlot
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

export const renderVectorPlotSettings = (
	el: HTMLElement,
	graph: VectorPlot
) => {
	new Setting(el.createDiv()).setName("Vx(x,y) = ").addTextArea((component) =>
		component.setValue(graph.components[0]).onChange((value) => {
			graph.components[0] = value;
		})
	);
	new Setting(el.createDiv()).setName("Vy(x,y) = ").addTextArea((component) =>
		component.setValue(graph.components[1]).onChange((value) => {
			graph.components[1] = value;
		})
	);
	new Setting(el.createDiv()).setName("Vz(x,y) = ").addTextArea((component) =>
		component.setValue(graph.components[2]).onChange((value) => {
			graph.components[2] = value;
		})
	);
	renderIntervalForm(el, "x", graph.domain.x);
	renderIntervalForm(el, "y", graph.domain.y);
	renderIntervalForm(el, "z", graph.domain.z);
};

const optsFields: OptionsFields = {
	...optsFields2D,
	boundaryStyle: {
		name: "Boundary Style",
		desc: "How to draw boundary lines for surfaces",
	},
};

export const renders3D: RenderSettings = {
	renderSettings: {
		plot: renderPlotSettings,
		parametricPlot: renderParametricPlotSettings,
		regionPlot: renderRegionPlotSettings,
		contourPlot: renderContourPlotSettings,
		vectorPlot: renderVectorPlotSettings,
	},
	renderOptions: renderOptions(optsFields),
};
