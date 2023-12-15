import { MarkdownView } from "obsidian";

export const isReadingView = (markdownView: MarkdownView) =>
	markdownView.getMode() === "preview";

export const isEditingView = (markdownView: MarkdownView) =>
	markdownView.getMode() === "source";
