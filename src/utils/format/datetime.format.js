/**
 * @param {Date|string|number} time
 * @param {{
 *   format?: "dateTime" | "date" | "time",
 *   seconds?: boolean,
 *   numeric?: boolean,
 *   short?: boolean,
 * }} options
 * @returns {string}
 */
export function dateTimeFormat(
    time = new Date(),
    {
        format = "dateTime",
        seconds = false,
        short = false,
        numeric = false,
    } = {},
) {
    const date = new Date(time);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    if (format === "date") {
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",

            month: numeric ? "2-digit" : short ? "short" : "long",

            year: numeric
                ? short
                    ? "2-digit"
                    : "numeric"
                : short
                  ? "2-digit"
                  : "numeric",
        }).format(date);
    }

    if (format === "time") {
        return new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            ...(seconds && { second: "2-digit" }),
            hour12: false,
        }).format(date);
    }

    if (format === "dateTime") {
        return `${dateTimeFormat(date, {
            format: "date",
            short,
            numeric,
        })} ${dateTimeFormat(date, {
            format: "time",
            seconds,
        })}`;
    }
}

const short = Object.assign(
    (time, options = {}) =>
        dateTimeFormat(time, {
            format: "dateTime",
            short: true,
            seconds: false,
            ...options,
        }),
    {
        dateTime: (time, options = {}) =>
            dateTimeFormat(time, {
                format: "dateTime",
                short: true,
                seconds: false,
                ...options,
            }),

        date: (time, options = {}) =>
            dateTimeFormat(time, {
                format: "date",
                short: true,
                ...options,
            }),

        time: (time, options = {}) =>
            dateTimeFormat(time, {
                format: "time",
                seconds: false,
                ...options,
            }),
    },
);

export const datetime = Object.assign(
    (time, options = {}) =>
        dateTimeFormat(time, {
            format: "dateTime",
            seconds: true,
            ...options,
        }),
    {
        dateTime: (time, options = {}) =>
            dateTimeFormat(time, {
                format: "dateTime",
                seconds: true,
                ...options,
            }),

        date: (time, options = {}) =>
            dateTimeFormat(time, {
                format: "date",
                ...options,
            }),

        time: (time, options = {}) =>
            dateTimeFormat(time, {
                format: "time",
                seconds: true,
                ...options,
            }),

        short,
    },
);
