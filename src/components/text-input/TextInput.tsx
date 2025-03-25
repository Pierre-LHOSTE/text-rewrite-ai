"use client";
import { useI18nContext } from "@/i18n/i18n-react";
import { Input } from "antd";
import "./text-input.css";
import correctText from "@/server/correctText.action";
import { useOptionsStore } from "@/stores/options.store";
import { useResultStore } from "@/stores/result.store";
import TextDetails from "../text-details/TextDetails";

export default function TextInput() {
	const { LL, locale } = useI18nContext();
	const { selectedOptions } = useOptionsStore();
	const { setResult } = useResultStore();
	const { input, setInput, setOldInput } = useResultStore();

	async function correct() {
		const res = await correctText(input, selectedOptions);
		if (res.correctedText) {
			setResult(res);
			setOldInput(input);
		}
	}

	return (
		<div id="text-input">
			<Input.TextArea
				lang={locale}
				placeholder={LL.textInputPlaceholder()}
				style={{
					resize: "none",
				}}
				value={input}
				onChange={(e) => {
					setInput(e.target.value);
				}}
			/>
			<TextDetails
				details={[
					LL.textDetails.stats.characters(input.length),
					LL.textDetails.stats.words(
						input
							.split("\n")
							.join(" ")
							.split(" ")
							.filter((l) => l).length
					),
					LL.textDetails.stats.lines(input.split("\n").length),
				]}
				actions={[
					{
						action: correct,
						label: LL.textDetails.actions.correct(),
						type: "primary",
					},
				]}
			/>
		</div>
	);
}
