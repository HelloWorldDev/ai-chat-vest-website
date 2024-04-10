export default function ($t, $Toast, data, type) {
    const task_rewards = data.task_rewards;
    if (task_rewards && task_rewards.length > 0) {
        const text = task_rewards
            .filter((item) => item.value > 0)
            .map((item) => $t(item.symbol === "supe_point" ? "chatDialog.text14_2" : "chatDialog.text14_3", { x: item.value }))
            .join(" & ");
        $Toast({
            message: $t("chatDialog.text14") + $t("chatDialog.text14_1", { text }),
        });
    } else {
        type ? $Toast({ message: $t("chatDialog.text14") }) : null;
    }
}
