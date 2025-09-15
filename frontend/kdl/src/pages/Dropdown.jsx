import React, {useEffect, useState} from "react";

export default function DynamicDropdown({apiUrl, fieldName, label, value, onChange}) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(apiUrl);
                const data = await res.json();
                setOptions(data);
            } catch (err) {
                console.error("Ошибка загрузки данных:", err);
                setOptions([]);
            }
        };
        fetchData();
    }, [apiUrl]);

    return (
        <div className="dropdown">
          {label && <label className='dd-label'>{label}</label>}
          <select className='dd-select'
              value={value !== undefined && value !== null ? String(value) : ""}
              onChange={(e) => onChange(Number(e.target.value))}
          >
            <option value="">-- выберете --</option>
            {options.map(opt => (
                <option key={opt.id} value={String(opt.id)}>
                  {opt[fieldName]}
                </option>
            ))}
          </select>
        </div>
    );
}