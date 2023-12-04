import {
	defaultGraph,
	graphTypesOptions,
	renderOptions,
} from "modal/menus/graph/helpers";
import { renders2D } from "modal/menus/graph/settings2d";
import { renders3D } from "modal/menus/graph/settings3d";
import { PlotModal } from "modal/plotModal";
import { DropdownComponent, Setting } from "obsidian";
import { Dimensions, GraphTypes, PlotType } from "types/plot";

export type RenderSettings = {
	renderSettings: {
		[key in GraphTypes]: (
			el: HTMLElement,
			graph: PlotType[GraphTypes]
		) => void;
	};
	renderOptions: ReturnType<typeof renderOptions>;
};

const renderByDim: { [key in Dimensions]: RenderSettings } = {
	"2D": renders2D,
	"3D": renders3D,
};

export const render = (el: HTMLElement, modal: PlotModal, dim: Dimensions) => {
	const { renderSettings, renderOptions } = renderByDim[dim];

	const graphs = modal.settings.graphs;
	if (!graphs.length) graphs[0] = defaultGraph("graph_0", "plot");
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
						graphs.push(defaultGraph(name, "plot"));
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
				component.addOptions(graphTypesOptions);
				component.setValue(graph.type);
				component.onChange((value: GraphTypes) => {
					graph.type = value;
					renderSelectedGraphSettings();
				});
			});

		renderSettings[graph.type](selectedGraphEl, graph[graph.type]);

		renderOptions(selectedGraphEl, modal.settings, graph.options);
	};

	renderSelectedGraphSettings();
};

export const renderGraphSettings = (el: HTMLElement, modal: PlotModal) => {
	el.innerHTML = "";
	el.createEl("h5", { text: `Plot ${modal.settings.raster.dim}` });
	render(el, modal, modal.settings.raster.dim);
};
