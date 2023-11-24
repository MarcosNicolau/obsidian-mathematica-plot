import { PlotModal } from "modal/plotModal";
import { DropdownComponent, Setting } from "obsidian";
import { Curve, ScalarFields2D } from "types/plot";

type PlotMenu = (el: HTMLElement, modal: PlotModal) => void;

export const displayGraphSettings: PlotMenu = (el, modal) => {
	el.innerHTML = "";
	el.createEl("h5", { text: `Plot ${modal.settings.raster.type}` });
	if (modal.settings.raster.type === "2D") display2DSettings(el, modal);
	else display3DSettings(el, modal);
	new Setting(el).addButton((btn) =>
		btn
			.setButtonText("Submit")
			.setCta()
			.onClick(async () => {
				modal.close();
				const line = modal.editor.getCursor().line;
				modal.editor.setLine(
					line,
					`\`\`\`plot-mathematica \n ${JSON.stringify(
						modal.settings,
						null,
						4
					)}\`\`\``
				);
			})
	);
};

type Graph2D = {
	type: "scalarField" | "curve";
	settings: {
		curve: Curve;
		scalar: ScalarFields2D;
	};
};

const default2DGraph: Graph2D = {
	type: "curve",
	settings: {
		curve: {
			components: [],
			options: {},
			t: { max: "", min: "" },
		},
		scalar: {
			expression: "",
			options: {},
			plotRange: { x: { min: "", max: "" } },
		},
	},
};

export const display2DSettings: PlotMenu = (el, modal) => {
	const graphs: { [key: number]: Graph2D } = { 0: default2DGraph };
	let currentGraphKey = 0;
	let count = 0;
	let opts: DropdownComponent;
	new Setting(el).setName("Graphs").addDropdown((component) => {
		opts = component;
		component
			.addOptions({
				"0": `graph_${currentGraphKey}`,
				add: "+ add",
			})
			.onChange((value) => {
				if (value === "add") {
					count += 1;
					graphs[count] = default2DGraph;
					const name = `graph_${count}`;
					component.addOption(count.toString(), name);
					// Removing and re-adding the add field to keep it at the end
					component.selectEl.remove(component.selectEl.selectedIndex);
					component.addOption("add", "+ add");
					component.setValue(count.toString());
					renderGraphSettings();
				} else {
					currentGraphKey = Number(value);
					renderGraphSettings();
				}
			});
	});

	const currentGraphEl = el.createDiv();

	new Setting(el.createDiv()).addButton((component) =>
		component
			.setButtonText("Delete")
			.setWarning()
			.onClick((e) => {
				e.preventDefault();
				if (opts.selectEl.options.length === 2) return;
				delete graphs[currentGraphKey];
				opts.selectEl.remove(opts.selectEl.selectedIndex);
				currentGraphKey = Number(
					opts.selectEl.options[opts.selectEl.length - 2].value
				);
				opts.setValue(currentGraphKey.toString());
			})
	);

	const renderGraphSettings = () => {
		currentGraphEl.innerHTML = "";
		new Setting(currentGraphEl.createDiv())
			.setName("Type")
			.addDropdown((component) => {
				component.addOptions({
					curve: "Curve",
					scalarField: "Scalar field",
				});
				component.setValue(graphs[currentGraphKey].type);
				component.onChange((value) => {
					graphs[currentGraphKey].type =
						value == "scalarField" ? "scalarField" : "curve";
					renderGraphSettings();
				});
			});

		if (graphs[currentGraphKey].type === "curve")
			renderCurveSettings(graphs[currentGraphKey].settings.curve);
		else renderScalarFieldSettings(graphs[currentGraphKey].settings.scalar);
	};

	const renderScalarFieldSettings = (field: ScalarFields2D) => {};

	const renderCurveSettings = (curve: Curve) => {};

	renderGraphSettings();
};

export const display3DSettings: PlotMenu = (el, modal) => {};
