import { renders2D } from "modal/menus/graph/settings2d";
import { renders3D } from "modal/menus/graph/settings3d";
import { PlotModal } from "modal/plotModal";
import { DropdownComponent, Setting } from "obsidian";
import { Graph2DTypes, Graph3DTypes } from "types/plot";

type RenderType = {
	"2D": typeof renders2D;
	"3D": typeof renders3D;
};

const renderType: RenderType = {
	"2D": renders2D,
	"3D": renders3D,
};

export const render = (
	el: HTMLElement,
	modal: PlotModal,
	type: "2D" | "3D"
) => {
	const {
		defaultGraph,
		renderParametricPlotSettings,
		renderPlotSettings,
		renderOptions,
	} = renderType[type];

	modal.settings.graphs = [];
	modal.settings.graphs[0] = defaultGraph("graph_0");

	const graphs = modal.settings.graphs;
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
						graphs.push(defaultGraph(name));
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
				component.onChange((value: Graph2DTypes | Graph3DTypes) => {
					graph.type = value;
					renderSelectedGraphSettings();
				});
			});

		if (graph.type === "parametricPlot") {
			renderParametricPlotSettings(selectedGraphEl, graph);
		}
		if (graph.type === "plot") {
			renderPlotSettings(selectedGraphEl, graph);
		}

		renderOptions(selectedGraphEl, modal.settings, graph.options);
	};

	renderSelectedGraphSettings();
};

export const renderGraphSettings = (el: HTMLElement, modal: PlotModal) => {
	el.innerHTML = "";
	el.createEl("h5", { text: `Plot ${modal.settings.raster.type}` });
	render(el, modal, modal.settings.raster.type);
};
