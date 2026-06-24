import React, { useState } from 'react';

const YEARS = [2026, 2027, 2028, 2029, 2030];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const IPT_TEAMS = ['IPT 1', 'IPT 2', 'IPT 3', 'IPT 4', 'IPT 5', 'IPT 6'];
const WORK_SECTIONS = ['WS1', 'WS2', 'WS3', 'WS4', 'WS5', 'WS6', 'WS7'];
const WORK_TYPES = ['Excavation', 'Embankment', 'Frost Layer', 'Subgrade', 'Sub-ballast', 'Overload', 'Other'];
const MATERIAL_TYPES = ['Limestone - rockfill', 'Sand', 'Gravel', 'Limestone (Shale aggregate)', 'Soil'];
const QUARRIES = ['Anelema limestone', 'Kobra Limestone', 'Potsepa sand', 'Eassalu III sand', 'Tarva limestone', 'Tarva III limestone', 'Vangu sand', 'Viluvere sand', 'Tammistu gravel', 'Viluvere II gravel', 'Estonia mine'];
const GATES = ['Tootsi Station (EW)', 'Timmermanni Viadukt (EW)', 'Kivisilla viadukt (EW)', 'Urge station (EW)', 'IMF/Rääma bog', 'Jõekääru (EW)', 'Metsakalmistu (EW)'];

const WORKING_DAYS_PER_MONTH = 22;

const ForecastMatrix = () => {
  const [selections, setSelections] = useState({
    year: YEARS[0],
    iptTeam: IPT_TEAMS[0],
    workSection: WORK_SECTIONS[0],
    workType: WORK_TYPES[0],
    materialType: MATERIAL_TYPES[0],
    quarry: QUARRIES[0],
    gate: GATES[0],
  });

  const [monthlyValues, setMonthlyValues] = useState(
    MONTHS.reduce((acc, m) => ({ ...acc, [m]: '' }), {})
  );

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSelectionChange = (key, value) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  const handleMonthChange = (month, value) => {
    setMonthlyValues((prev) => ({ ...prev, [month]: value }));
  };

  const monthlySum = MONTHS.reduce(
    (sum, m) => sum + (parseFloat(monthlyValues[m]) || 0),
    0
  );

  const yearlySubtotal = monthlySum * WORKING_DAYS_PER_MONTH;

  const handleSubmit = async () => {
    setSubmitting(true);
    setStatusMsg(null);

    const payload = {
      ...selections,
      monthlyValues: MONTHS.reduce(
        (acc, m) => ({ ...acc, [m]: parseFloat(monthlyValues[m]) || 0 }),
        {}
      ),
      monthlySum,
      yearlySubtotal,
    };

    try {
      const res = await fetch('http://localhost:8000/api/forecasts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      await res.json().catch(() => ({}));
      setStatusMsg({ type: 'success', text: 'Forecast submitted successfully.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: `Submission failed: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  const Dropdown = ({ label, value, options, onChange }) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Rail Logistics Forecast Matrix
          </h1>
          <p className="text-sm text-gray-500">
            Enter monthly forecast quantities and submit for processing.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <Dropdown
            label="Year"
            value={selections.year}
            options={YEARS}
            onChange={(v) => handleSelectionChange('year', Number(v))}
          />
          <Dropdown
            label="IPT Team"
            value={selections.iptTeam}
            options={IPT_TEAMS}
            onChange={(v) => handleSelectionChange('iptTeam', v)}
          />
          <Dropdown
            label="Work Section"
            value={selections.workSection}
            options={WORK_SECTIONS}
            onChange={(v) => handleSelectionChange('workSection', v)}
          />
          <Dropdown
            label="Work Type"
            value={selections.workType}
            options={WORK_TYPES}
            onChange={(v) => handleSelectionChange('workType', v)}
          />
          <Dropdown
            label="Material Type"
            value={selections.materialType}
            options={MATERIAL_TYPES}
            onChange={(v) => handleSelectionChange('materialType', v)}
          />
          <Dropdown
            label="Quarry"
            value={selections.quarry}
            options={QUARRIES}
            onChange={(v) => handleSelectionChange('quarry', v)}
          />
          <Dropdown
            label="Gate"
            value={selections.gate}
            options={GATES}
            onChange={(v) => handleSelectionChange('gate', v)}
          />
        </div>

        <div className="mb-6 overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Metric
                </th>
                {MONTHS.map((m) => (
                  <th
                    key={m}
                    className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    {m}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700">
                  Daily Quantity
                </td>
                {MONTHS.map((m) => (
                  <td key={m} className="px-2 py-2">
                    <input
                      type="number"
                      value={monthlyValues[m]}
                      onChange={(e) => handleMonthChange(m, e.target.value)}
                      className="w-20 rounded-md border border-gray-300 px-2 py-1 text-center text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                  {monthlySum.toLocaleString()}
                </td>
              </tr>
              <tr className="bg-indigo-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-indigo-800">
                  Yearly Subtotal
                </td>
                <td
                  colSpan={MONTHS.length}
                  className="px-4 py-3 text-sm text-indigo-700"
                >
                  SUM(months) × {WORKING_DAYS_PER_MONTH} working days
                </td>
                <td className="px-4 py-3 text-center text-sm font-bold text-indigo-900">
                  {yearlySubtotal.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Forecast'}
          </button>

          {statusMsg && (
            <span
              className={`text-sm font-medium ${
                statusMsg.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {statusMsg.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForecastMatrix;