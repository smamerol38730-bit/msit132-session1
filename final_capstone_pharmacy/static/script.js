// ==========================================
// PHARMASTOCK FRONTEND
// ==========================================


// ------------------------------------------
// ELEMENT REFERENCES
// ------------------------------------------

const drugSearchButton =
    document.getElementById("drug-search-button");

const drugNameInput =
    document.getElementById("drug-name");

const drugResult =
    document.getElementById("drug-result");


const stockCheckButton =
    document.getElementById("stock-check-button");

const medicineInput =
    document.getElementById("medicine");

const currentStockInput =
    document.getElementById("current-stock");

const averageSalesInput =
    document.getElementById("average-sales");

const reorderLevelInput =
    document.getElementById("reorder-level");

const stockResult =
    document.getElementById("stock-result");



// ==========================================
// DRUG INFORMATION
// ==========================================

drugSearchButton.addEventListener(
    "click",
    searchDrug
);


drugNameInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            searchDrug();
        }

    }
);


async function searchDrug() {

    const drugName =
        drugNameInput.value.trim();


    if (!drugName) {

        showDrugError(
            "Please enter a medicine name."
        );

        return;
    }


    drugResult.className =
        "result-box";


    drugResult.innerHTML = `
        <div class="loading-message">
            Searching medicine information...
        </div>
    `;


    try {

        const response =
            await fetch(
                `/api/drug/${
                    encodeURIComponent(drugName)
                }`
            );


        const data =
            await response.json();


        if (!response.ok) {

            showDrugError(
                data.error ||
                "Medicine information could not be retrieved."
            );

            return;
        }


        displayDrugResult(data);

    }

    catch (error) {

        showDrugError(
            "Unable to connect to the pharmacy microservice."
        );

    }

}



// ==========================================
// DRUG RESULT
// ==========================================

function displayDrugResult(data) {

    let route =
        data.route;


    if (Array.isArray(route)) {

        route =
            route.join(", ");

    }


    const visual =
        getMedicineVisual(
            data.dosage_form,
            data.generic_name
        );


    drugResult.className =
        "result-box";


    drugResult.innerHTML = `

        <div class="medicine-result-header">

            <div
                class="
                    medicine-type-icon
                    ${visual.type}
                "
            >
                ${visual.svg}
            </div>


            <div>

                <span class="result-label">
                    MEDICINE FOUND
                </span>

                <h3>
                    ${safe(
                        data.generic_name
                    )}
                </h3>

                <span class="dosage-badge">
                    ${safe(
                        data.dosage_form
                    )}
                </span>

            </div>

        </div>


        <div class="result-details">

            ${detailRow(
                "Generic Name",
                data.generic_name
            )}

            ${detailRow(
                "Brand Name",
                data.brand_name
            )}

            ${detailRow(
                "Dosage Form",
                data.dosage_form
            )}

            ${detailRow(
                "Route",
                route
            )}

            ${detailRow(
                "Manufacturer",
                data.manufacturer
            )}

        </div>


        <div class="result-source">
            Source: openFDA External API
        </div>
    `;

}



// ==========================================
// MEDICINE ICON
// ==========================================

function getMedicineVisual(
    dosageForm,
    medicineName
) {

    const description = `${
        dosageForm || ""
    } ${
        medicineName || ""
    }`.toLowerCase();


    // TABLET / CAPSULE
    if (
        description.includes("tablet") ||
        description.includes("capsule") ||
        description.includes("caplet")
    ) {

        return {

            type: "tablet",

            svg: `
                <svg
                    width="50"
                    height="50"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="currentColor"
                >

                    <g
                        transform="
                            rotate(-40 32 32)
                        "
                    >

                        <rect
                            x="20"
                            y="7"
                            width="24"
                            height="50"
                            rx="12"
                        ></rect>

                        <line
                            x1="20"
                            y1="32"
                            x2="44"
                            y2="32"
                        ></line>

                        <path
                            class="medicine-icon-fill"
                            d="
                                M20 32
                                H44
                                V45
                                C44 51.6
                                38.6 57
                                32 57
                                C25.4 57
                                20 51.6
                                20 45
                                Z
                            "
                        ></path>

                    </g>

                </svg>
            `

        };

    }


    // LIQUID / SYRUP
    if (
        description.includes("syrup") ||
        description.includes("liquid") ||
        description.includes("solution") ||
        description.includes("suspension") ||
        description.includes("elixir")
    ) {

        return {

            type: "liquid",

            svg: `
                <svg
                    width="50"
                    height="50"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="currentColor"
                >

                    <rect
                        x="23"
                        y="6"
                        width="18"
                        height="8"
                        rx="2"
                    ></rect>

                    <path
                        d="
                            M22 14
                            H42
                            V20
                            C46 23
                            48 27
                            48 32
                            V51
                            C48 55
                            45 58
                            41 58
                            H23
                            C19 58
                            16 55
                            16 51
                            V32
                            C16 27
                            18 23
                            22 20
                            Z
                        "
                    ></path>

                    <rect
                        class="medicine-icon-fill"
                        x="21"
                        y="32"
                        width="22"
                        height="14"
                        rx="3"
                    ></rect>

                    <line
                        x1="27"
                        y1="39"
                        x2="37"
                        y2="39"
                    ></line>

                </svg>
            `

        };

    }


    // UNKNOWN / OTHER
    return {

        type: "mixed",

        svg: `
            <svg
                width="50"
                height="50"
                viewBox="0 0 72 64"
                fill="none"
                stroke="currentColor"
            >

                <!-- Bottle -->

                <rect
                    x="42"
                    y="7"
                    width="13"
                    height="7"
                    rx="2"
                ></rect>

                <path
                    d="
                        M41 14
                        H56
                        V20
                        C59 23
                        60 27
                        60 31
                        V49
                        C60 53
                        57 56
                        53 56
                        H43
                        C39 56
                        36 53
                        36 49
                        V31
                        C36 27
                        38 23
                        41 20
                        Z
                    "
                ></path>

                <rect
                    class="medicine-icon-fill"
                    x="40"
                    y="32"
                    width="16"
                    height="12"
                    rx="3"
                ></rect>


                <!-- Capsule -->

                <g
                    transform="
                        rotate(-40 23 39)
                    "
                >

                    <rect
                        x="15"
                        y="23"
                        width="16"
                        height="33"
                        rx="8"
                    ></rect>

                    <line
                        x1="15"
                        y1="40"
                        x2="31"
                        y2="40"
                    ></line>

                </g>

            </svg>
        `

    };

}



// ==========================================
// STOCK CHECK
// ==========================================

stockCheckButton.addEventListener(
    "click",
    checkInventory
);


async function checkInventory() {

    const medicine =
        medicineInput.value.trim();

    const currentStock =
        currentStockInput.value;

    const averageSales =
        averageSalesInput.value;

    const reorderLevel =
        reorderLevelInput.value;


    if (
        !medicine ||
        currentStock === "" ||
        averageSales === "" ||
        reorderLevel === ""
    ) {

        showStockError(
            "Please complete all inventory fields."
        );

        return;
    }


    const payload = {

        medicine:
            medicine,

        current_stock:
            Number(currentStock),

        average_daily_sales:
            Number(averageSales),

        reorder_level:
            Number(reorderLevel)

    };


    stockResult.className =
        "result-box";


    stockResult.innerHTML = `
        <div class="loading-message">
            Analyzing inventory...
        </div>
    `;


    try {

        const response =
            await fetch(
                "/api/stock/check",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showStockError(
                data.error ||
                "Unable to analyze inventory."
            );

            return;
        }


        displayStockResult(data);

    }

    catch (error) {

        showStockError(
            "Unable to connect to the pharmacy microservice."
        );

    }

}



// ==========================================
// STOCK RESULT
// ==========================================

function displayStockResult(data) {

    const lowStock =
        data.reorder_required === true;


    stockResult.className =
        lowStock
            ? "result-box status-low"
            : "result-box status-good";


    const statusName =
        lowStock
            ? "Low Stock"
            : "Sufficient Stock";


    const icon = lowStock

        ? `
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
            >
                <path d="M12 4L3 20H21L12 4Z"></path>
                <path d="M12 9V14"></path>
                <circle
                    cx="12"
                    cy="17"
                    r="0.8"
                    fill="currentColor"
                    stroke="none"
                ></circle>
            </svg>
        `

        : `
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
            >
                <path d="M5 12L9 16L19 6"></path>
            </svg>
        `;


    stockResult.innerHTML = `

        <div class="result-title-row">

            <div
                class="
                    result-status-icon
                    ${
                        lowStock
                            ? "warning"
                            : "success"
                    }
                "
            >
                ${icon}
            </div>


            <div>

                <span class="result-label">
                    INVENTORY RESULT
                </span>

                <h3>
                    ${safe(
                        data.medicine
                    )}
                </h3>

            </div>

        </div>


        <div class="stock-status-banner">

            <span>
                Stock Status
            </span>

            <strong>
                ${statusName}
            </strong>

        </div>


        <div class="result-details">

            ${detailRow(
                "Current Stock",
                `${formatNumber(
                    data.current_stock
                )} units`
            )}

            ${detailRow(
                "Average Daily Sales",
                `${formatNumber(
                    data.average_daily_sales
                )} units/day`
            )}

            ${detailRow(
                "Reorder Level",
                `${formatNumber(
                    data.reorder_level
                )} units`
            )}

            ${detailRow(
                "Estimated Supply",
                `${formatNumber(
                    data.estimated_days_remaining
                )} days`,
                true
            )}

            ${detailRow(
                "Estimated Stockout Date",
                formatDate(
                    data.estimated_stockout_date
                ),
                true
            )}

            ${detailRow(
                "Estimated Stockout Day",
                data.estimated_stockout_day
            )}

            ${detailRow(
                "Reorder Required",
                lowStock
                    ? "Yes"
                    : "No"
            )}

        </div>


        <div
            class="
                inventory-message
                ${
                    lowStock
                        ? "warning-message"
                        : "success-message"
                }
            "
        >
            ${safe(
                data.message
            )}
        </div>
    `;

}



// ==========================================
// ERRORS
// ==========================================

function showDrugError(message) {

    drugResult.className =
        "result-box status-error";


    drugResult.innerHTML = `

        <div class="result-title-row">

            <div
                class="
                    result-status-icon
                    error
                "
            >

                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path d="M6 6L18 18"></path>
                    <path d="M18 6L6 18"></path>
                </svg>

            </div>


            <div>

                <span class="result-label">
                    ERROR
                </span>

                <h3>
                    Drug Search Failed
                </h3>

            </div>

        </div>


        <p class="error-message">
            ${safe(message)}
        </p>
    `;

}



function showStockError(message) {

    stockResult.className =
        "result-box status-error";


    stockResult.innerHTML = `

        <div class="result-title-row">

            <div
                class="
                    result-status-icon
                    error
                "
            >

                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path d="M6 6L18 18"></path>
                    <path d="M18 6L6 18"></path>
                </svg>

            </div>


            <div>

                <span class="result-label">
                    VALIDATION ERROR
                </span>

                <h3>
                    Inventory Check Failed
                </h3>

            </div>

        </div>


        <p class="error-message">
            ${safe(message)}
        </p>
    `;

}



// ==========================================
// HELPERS
// ==========================================

function detailRow(
    label,
    value,
    highlight = false
) {

    return `

        <div
            class="
                detail-row
                ${
                    highlight
                        ? "highlight-row"
                        : ""
                }
            "
        >

            <span>
                ${safe(label)}
            </span>

            <strong>
                ${safe(value)}
            </strong>

        </div>
    `;

}



function formatNumber(value) {

    const number =
        Number(value);


    if (Number.isInteger(number)) {

        return number.toString();

    }


    return number.toFixed(2);

}



function formatDate(value) {

    if (!value) {

        return "Not available";

    }


    const pieces =
        value.split("-");


    if (pieces.length !== 3) {

        return value;

    }


    const date =
        new Date(
            Number(pieces[0]),
            Number(pieces[1]) - 1,
            Number(pieces[2])
        );


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}



function safe(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "Not available";

    }


    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}