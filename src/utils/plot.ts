import { promisify } from "util";
import { exec } from "child_process";

export const getSVGPlot = async (code: string) => {
	const { stdout, stderr } = await promisify(exec)(
		`wolframscript --code 'ExportString[Rasterize[${code}, Background -> None, ImageSize -> {300, 300}], {"Base64", "PNG"}]'`
	);
	if (stderr) return "ERROR";
	return stdout;
};
