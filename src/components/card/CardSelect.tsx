import { Checkbox, type CheckboxChangeEvent, type GlobalToken, Typography, theme } from "antd";
import "./card-select.scss";
import type { CategoryType, CategoryOptions, SelectedOptionsType } from "@/types/options";
import { useOptionsStore } from "@/stores/options.store";
import type React from "react";
import c from "classnames";

const { useToken } = theme;

export default function CardSelect({
	title,
	description,
	options,
	id,
}: {
	title: string;
	description: string;
	options: CategoryOptions[];
	id: CategoryType;
}) {
	const { token } = useToken();
	const { selectedOptions, selectOption, deselectOption, selectAllOptions, deselectAllOptions } =
		useOptionsStore();

	const selectedCard = getSelected(selectedOptions);
	const isSelected = selectedCard === id;

	const isForcedSelected = getIsForcedSelected(id, selectedCard);

	const selectedOptionArray: CategoryOptions[] = Array.from(selectedOptions.get(id) || []);

	function handleCardSelection(e: React.KeyboardEvent | React.MouseEvent, id: CategoryType) {
		if ("key" in e && e.key !== "Enter" && e.key !== " ") return;
		console.log("Card selected:", id);
	}

	function handleCheckAll(e: CheckboxChangeEvent) {
		e.stopPropagation();
		if (e.target.checked) {
			selectAllOptions(id);
		} else {
			deselectAllOptions(id);
		}
	}

	function handleCheckbox(e: CheckboxChangeEvent, id: CategoryType, value: CategoryOptions) {
		e.stopPropagation();

		if (e.target.checked) {
			selectOption(id, value);
		}
		if (!e.target.checked && selectedOptionArray.length > 1) {
			deselectOption(id, value);
		}
	}

	function handleStopPropagation(e: {
		stopPropagation: () => void;
	}) {
		e.stopPropagation();
	}

	return (
		// biome-ignore lint/nursery/noStaticElementInteractions: <explanation>
		<div
			className={c("card-select", { selected: isSelected })}
			style={{
				backgroundColor: getBackgroundColor(isSelected, isForcedSelected, token),
				borderColor: getBorderColor(isSelected, isForcedSelected, token),
			}}
			onClick={(e) => handleCardSelection(e, id)}
			onKeyUp={(e) => handleCardSelection(e, id)}
		>
			<Typography.Title level={4}>
				<Checkbox
					checked={isSelected || isForcedSelected}
					indeterminate={
						selectedOptionArray.length > 0 && selectedOptionArray.length < options.length
					}
					onChange={handleCheckAll}
					onClick={handleStopPropagation}
				>
					<Typography.Text onClick={handleStopPropagation}>{title}</Typography.Text>
				</Checkbox>
			</Typography.Title>
			<Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
			<div className="card-options">
				{options.map((value) => (
					<Checkbox
						key={value}
						checked={selectedOptionArray.includes(value)}
						onClick={handleStopPropagation}
						onChange={(e) => handleCheckbox(e, id, value)}
					>
						<Typography.Text onClick={handleStopPropagation}>{value}</Typography.Text>
					</Checkbox>
				))}
			</div>
		</div>
	);
}

function getBackgroundColor(isSelected: boolean, isForcedSelected: boolean, token: GlobalToken) {
	if (isSelected) return token.colorPrimaryBg;
	if (isForcedSelected) return token.colorBgContainerDisabled;
	return token.colorBgContainer;
}

function getBorderColor(isSelected: boolean, isForcedSelected: boolean, token: GlobalToken) {
	if (isSelected) return token.colorPrimaryBorder;
	if (isForcedSelected) return token.colorBgContainerDisabled;
	return token.colorBorder;
}

function getSelected(selectedOptions: SelectedOptionsType): CategoryType {
	if ((selectedOptions.get("heavy")?.size ?? 0) > 0) return "heavy";
	if ((selectedOptions.get("moderate")?.size ?? 0) > 0) return "moderate";
	return "minimal";
}

function getIsForcedSelected(id: CategoryType, selectedCard: CategoryType) {
	if (selectedCard === "minimal") return false;
	if (selectedCard === "moderate") {
		if (id === "minimal") return true;
		return false;
	}
	if (selectedCard === "heavy") {
		if (id === "minimal" || id === "moderate") return true;
		return false;
	}
	return false;
}
