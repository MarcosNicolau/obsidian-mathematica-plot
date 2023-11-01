import { execSync } from "child_process";

export const getSVGPlot = (code: string) => {
	return execSync(
		`wolframscript --code 'ExportString[${code}, {"Base64", "PNG"}]'`,
		{ encoding: "utf-8" }
	);
};
