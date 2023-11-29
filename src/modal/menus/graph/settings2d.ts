import { PlotModal } from "modal/plotModal";
import { DropdownComponent, Setting } from "obsidian";
import {
	Graph2D,
	Graph2DTypes,
	Options2D,
	ParametricPlot2D,
	Plot2D,
	Settings,
} from "types/plot";

const default2DGraph = (id: string): Graph2D => ({
	type: "plot",
	id,
	parametricPlot: {
		components: [],
		t: { max: "", min: "" },
	},
	plot: {
		expression: "",
		plotRange: { x: { min: "", max: "" } },
	},
	options: {},
});

const renderOptions = (
	el: HTMLElement,
	settings: Settings,
	options: Graph2D["options"]
) => {
	const optNames: { [key in keyof Omit<Options2D, "others">]: string } = {
		plotLabels: "Plot Labels",
		plotLegends: "Plot Legends",
		plotStyle: "Plot Style",
		filling: "Filling",
		fillingStyle: "Filling Style",
	};
	el.createEl("h5", {
		text: `Plot Options ${settings.raster.type}`,
	});
	Object.entries(optNames).forEach(
		(entry: [keyof Options2D, string], index) =>
			new Setting(index === 0 ? el : el.createDiv())
				.setName(entry[1])
				.addText((component) =>
					component
						.setValue(options[entry[0]] || "")
						.onChange((value) => {
							options[entry[0]] = value;
						})
				)
	);
	new Setting(el.createDiv())
		.setName("Others")
		.setDesc(
			"Add any other option for the plot following the mathematica syntax"
		)
		.addTextArea((component) =>
			component.setValue(options.others || "").onChange((value) => {
				options.others = value;
			})
		);
};

const renderPlotSettings = (el: HTMLElement, plot: Plot2D) => {
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

const renderParametricPlotSettings = (
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
		component.setValue(parametricPlot.t.min).onChange((value) => {
			parametricPlot.t.min = value;
		})
	);
	new Setting(el.createDiv()).setName("t max").addText((component) =>
		component.setValue(parametricPlot.t.max).onChange((value) => {
			parametricPlot.t.max = value;
		})
	);
};

export const render2DSettings = (el: HTMLElement, modal: PlotModal) => {
	const graphs = modal.settings.graphs.dim2;
	let count = 0;
	let dropdown: DropdownComponent;

	new Setting(el)
		.setName("Graphs")
		.addDropdown((component) => {
			dropdown = component;
			component
				.addOptions({
					[graphs[0].id]: graphs[0].id,
					add: "+ add",
				})
				.onChange((value) => {
					if (value === "add") {
						const name = `graph_${++count}`;
						graphs.push(default2DGraph(name));
						component.addOption(name, name);
						// Removing and re-adding the add field to keep it at the end
						component.selectEl.remove(
							component.selectEl.selectedIndex
						);
						component.addOption("add", "+ add");
						component.setValue(name);
					}
					renderSelectedGraphSettings();
				});
		})
		.addButton((component) =>
			component
				.setButtonText("Delete")
				.setWarning()
				.onClick((e) => {
					e.preventDefault();
					// At least one graph should exist
					// Checking for two because of the add option
					if (dropdown.selectEl.options.length === 2) return;
					const idxToRmv = graphs.findIndex(
						(graph) =>
							graph.id ===
							dropdown.selectEl.options[
								dropdown.selectEl.selectedIndex
							].value
					);
					graphs.splice(idxToRmv, 1);
					dropdown.selectEl.remove(dropdown.selectEl.selectedIndex);
					renderSelectedGraphSettings();
				})
		);

	const selectedGraphEl = el.createDiv();

	const renderSelectedGraphSettings = () => {
		selectedGraphEl.innerHTML = "";
		const graph = graphs.find(
			(graph) =>
				graph.id ===
				dropdown.selectEl.options[dropdown.selectEl.selectedIndex].value
		);
		if (!graph) return;

		new Setting(selectedGraphEl.createDiv())
			.setName("Type")
			.addDropdown((component) => {
				component.addOptions({
					plot: "Plot",
					parametricPlot: "Parametric Plot",
				});
				component.setValue(graph.type);
				component.onChange((value: Graph2DTypes) => {
					graph.type = value;
					renderSelectedGraphSettings();
				});
			});

		if (graph.type === "parametricPlot") {
			if (!graph.parametricPlot) {
				graph.parametricPlot = {
					components: [],
					t: { min: "", max: "" },
				};
			}
			renderParametricPlotSettings(selectedGraphEl, graph.parametricPlot);
		}
		if (graph.type === "plot") {
			if (!graph.plot) {
				graph.plot = {
					expression: "",
					plotRange: { x: { min: "", max: "" } },
				};
			}
			renderPlotSettings(selectedGraphEl, graph.plot);
		}

		renderOptions(selectedGraphEl, modal.settings, graph.options);
	};

	renderSelectedGraphSettings();
};
