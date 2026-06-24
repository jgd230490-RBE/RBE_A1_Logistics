import React, { useState, useMemo } from 'react';

const YEARS = [2026, 2027, 2028, 2029, 2030];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const IPT_TEAMS = ['IPT 1', 'IPT 2', 'IPT 3', 'IPT 4', 'IPT 5', 'IPT 6'];
const WORK_SECTIONS = ['WS1', 'WS2', 'WS3', 'WS4', 'WS5', 'WS6', 'WS7'];
const WORK_TYPES = ['Excavation', 'Embankment', 'Frost Layer', 'Subgrade', 'Sub-ballast', 'Overload', 'Other'];
const MATERIAL_TYPES = ['Limestone - rockfill', 'Sand', 'Gravel', 'Limestone (Shale aggregate)', 'Soil'];
const QUARRIES = ['Anelema limestone', 'Kobra Limestone', 'Potsepa sand', 'Eassalu III sand', 'Tarva limestone', 'Tarva III limestone', 'Vangu sand', 'Viluvere sand', 'Tammistu gravel', 'Viluvere II gravel', 'Estonia mine'];
const GATES = ['Tootsi Station (EW)', 'Timmermanni Viadukt (EW)', 'Kivisilla viadukt (EW)', 'Urge station (EW)', 'IMF/Rääma bog', 'Jõekääru (EW)', 'Metsakalmistu (EW)'];

const WORKING_DAYS = 22;

const ForecastMatrix = () => {
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  const [filters, setFilters] = useState({
    iptTeam: IPT_TEAMS[0],
    workSection: WORK_SECTIONS[0],
    workType: WORK_TYPES[0],
    materialType: MATERIAL_TYPES[0],
    quarry: QUARRIES[0],
    gate: GATES[0],
  });

  const [monthValues, setMonthValues] = useState(
    MONTHS.reduce((acc, m) => ({ ...acc, [m]: '' }), {})
  );

  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMonthChange = (month, value) => {
    setMonthValues((prev) => ({ ...prev, [month]: value }));
  };

  const monthlyNumbers = useMemo(
    () => MONTHS.map((m) => parseFloat(monthValues[m]) || 0),
    [monthValues]
  );

  const monthlyTotal = useMemo(
    () => monthlyNumbers.reduce((sum, v) => sum + v, 0),
    [monthlyNumbers]
  );

  const yearlySubtotal = useMemo(() => monthlyTotal * WORKING_DAYS, [monthlyTotal]);

  const handleSubmit = async () => {
    setStatus({ loading: true, message: '', error: false });

    const payload = {
      year: selectedYear,
      ...filters,
      monthlyDailyRates: monthValues,
      monthlyTotal,
      yearlySubtotal,
      workingDaysPerMonth: WORKING_DAYS,
    };

    try {
      const response = await fetch('http://localhost:8000/api/forecasts/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      await response.json().catch(() => ({}));
      setStatus({ loading: false, message: 'Forecast submitted successfully.', error: false });
    } catch (err) {
      setStatus({ loading: false, message: `Submission failed: ${err.message}`, error: true });
    }
  };

  const SelectField = ({ label, value, options, onChange }) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rail Logistics Forecast Matrix</h1>
            <p className="text-sm text-gray-500">Plan material delivery forecasts per IPT team and work section.</p>
          </div>
          <div className="w-40">
            <SelectField
              label="Forecast Year"
              value={selectedYear}
              options={YEARS}
              onChange={(v) => setSelectedYear(Number(v))}
            />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="IPT Team"
            value={filters.iptTeam}
            options={IPT_TEAMS}
            onChange={(v) => handleFilterChange('iptTeam', v)}
          />
          <SelectField
            label="Work Section"
            value={filters.workSection}
            options={WORK_SECTIONS}
            onChange={(v) => handleFilterChange('workSection', v)}
          />
          <SelectField
            label="Work Type"
            value={filters.workType}
            options={WORK_TYPES}
            onChange={(v) => handleFilterChange('workType', v)}
          />
          <SelectField
            label="Material Type"
            value={filters.materialType}
            options={MATERIAL_TYPES}
            onChange={(v) => handleFilterChange('materialType', v)}
          />
          <SelectField
            label="Quarry"
            value={filters.quarry}
            options={QUARRIES}
            onChange={(v) => handleFilterChange('quarry', v)}
          />
          <SelectField
            label="Gate"
            value={filters.gate}
            options={GATES}
            onChange={(v) => handleFilterChange('gate', v)}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Metric
                </th>
                {MONTHS.map((m) => (
                  <th
                    key={m}
                    className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {m}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                  Daily Rate
                </td>
                {MONTHS.map((m) => (
                  <td key={m} className="px-2 py-2">
                    <input
                      type="number"
                      min="0"
                      value={monthValues[m]}
                      onChange={(e) => handleMonthChange(m, e.target.value)}
                      className="w-20 rounded-md border border-gray-300 px-2 py-1 text-center text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center text-sm font-semibold text-gray-800">
                  {monthlyTotal.toLocaleString()}
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="sticky left-0 z-10 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
                  Monthly Volume (×{WORKING_DAYS})
                </td>
                {monthlyNumbers.map((v, i) => (
                  <td key={MONTHS[i]} className="px-4 py-3 text-center text-sm text-blue-700">
                    {(v * WORKING_DAYS).toLocaleString()}
                  </td>
                ))}
                <td className="px-4 py-3 text-center text-sm font-bold text-blue-900">
                  {yearlySubtotal.toLocaleString()}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td
                  colSpan={MONTHS.length + 1}
                  className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wider text-gray-700"
                >
                  Yearly Subtotal
                </td>
                <td className="px-4 py-3 text-center text-base font-extrabold text-gray-900">
                  {yearlySubtotal.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 flex flex-col items-end gap-3">
          {status.message && (
            <div
              className={`w-full rounded-lg px-4 py-3 text-sm ${
                status.error
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {status.message}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={status.loading}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {status.loading ? 'Submitting...' : 'Submit Forecast'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForecastMatrix;