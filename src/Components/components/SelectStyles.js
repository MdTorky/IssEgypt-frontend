const SelectStyles = (darkMode) => ({
    control: (baseStyles, state) => ({
        ...baseStyles,
        borderRadius: "15px",
        padding: "5px",
        cursor: "pointer",
        background: darkMode ? "linear-gradient(to right, var(--hover), var(--hover2));" : '',
        border: state.isFocused ? "3px solid var(--theme)" : "3px solid lightgrey",
        // "&:hover": {
        //     borderColor: "red",
        //     color: "red"
        // }
    }),

    option: (baseStyles, state) => ({
        ...baseStyles,
        fontSize: "1em",
        cursor: "pointer",
        // borderRadius: "10px",
        color: state.isSelected ? "var(--bg)" : "",
        ":hover": { background: darkMode ? "var(--bg)" : "var(--theme2)", color: darkMode ? "var(--hover)" : "var(--bg)" }


    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: darkMode ? 'var(--bg)' : 'var(--theme)',
    }),
    noOptionsMessage: (provided, state) => ({
        ...provided,
        color: 'red',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }),
    menu: (provided, state) => ({
        ...provided,
        background: darkMode ? 'var(--hover)' : "var(--bg2)",
        borderRadius: "10px",
        zIndex: "9999",
        border: "3px solid var(--theme)"
    }),
    placeholder: (provided, state) => ({
        ...provided,
        color: darkMode ? "var(--bg)" : "var(--hover)"
    }),
    singleValue: (defaultStyles) => ({
        ...defaultStyles,
        // color: darkMode ? "var(--theme)" : "var(--theme)"
        color: "var(--theme)",
        fontWeight: "700",
        textTransform: "uppercase",
    }),
    input: (defaultStyles) => ({
        ...defaultStyles,
        color: darkMode ? "var(--bg)" : "var(--theme2)"
    }),
});

export default SelectStyles;