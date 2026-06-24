import React, { useState, useMemo } from 'react';

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
  const [filters, setFilters] = useState({
    year: YEARS[0],
    iptTeam: IPT_TEAMS[0],
    workSection: WORK_SECTIONS[0],
    workType: WORK_TYPES[0],
    materialType: MATERIAL_TYPES[0],
    quarry: QUARRIES[0],
    gate: GATES[0],
  });

  const [monthlyValues, setMonthlyValues] = useState(() =>
    MONTHS.reduce((acc, m) => ({ ...acc, [m]: '' }), {})
  );

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMonthChange = (month, value) => {
    setMonthlyValues((prev) => ({ ...prev, [month]: value }));
  };

  const monthlyTotal = useMemo(() => {
    return MONTHS.reduce((sum, m) => sum + (parseFloat(monthlyValues[m]) || 0), 0);
  }, [monthlyValues]);

  const yearlySubtotal = useMemo(() => {
    return monthlyTotal * WORKING_DAYS_PER_MONTH;
  }, [monthlyTotal]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setStatusMessage(null);

    const payload = {
      ...filters,
      workingDaysPerMonth: WORKING_DAYS_PER_MONTH,
      months: MONTHS.reduce(
        (acc, m) => ({ ...acc, [m]: parseFloat(monthlyValues[m]) || 0 }),
        {}
      ),
      monthlyTotal,
      yearlySubtotal,
    };

    try {
      const response = await fetch('http://localhost:8000/api/forecasts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      await response.json().catch(() => ({}));
      setStatusMessage({ type: 'success', text: 'Forecast submitted successfully.' });
    } catch (error) {
      setStatusMessage({ type: 'error', text: `Submission failed: ${error.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  const renderSelect = (label, key, options) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <select
        value={filters[key]}
        onChange={(e) => handleFilterChange(key, e.target.value)}
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-lg bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-800">Rail Logistics Forecast Matrix</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure parameters and enter monthly forecast values. Yearly subtotal assumes{' '}
            {WORKING_DAYS_PER_MONTH} working days per month.
          </p>
        </header>

        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Selection Parameters</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {renderSelect('Year', 'year', YEARS)}
            {renderSelect('IPT Team', 'iptTeam', IPT_TEAMS)}
            {renderSelect('Work Section', 'workSection', WORK_SECTIONS)}
            {renderSelect('Work Type', 'workType', WORK_TYPES)}
            {renderSelect('Material Type', 'materialType', MATERIAL_TYPES)}
            {renderSelect('Quarry', 'quarry', QUARRIES)}
            {renderSelect('Gate', 'gate', GATES)}
          </div>
        </section>

        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Monthly Forecast</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="sticky left-0 z-10 border-b border-gray-200 bg-gray-50 px-4 py-3 text-left font-medium text-gray-600">
                    Metric
                  </th>
                  {MONTHS.map((m) => (
                    <th
                      key={m}
                      className="border-b border-gray-200 px-3 py-3 text-center font-medium text-gray-600"
                    >
                      {m}
                    </th>
                  ))}
                  <th className="border-b border-gray-200 px-4 py-3 text-center font-medium text-gray-600">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="sticky left-0 z-10 border-b border-gray-200 bg-white px-4 py-3 font-medium text-gray-700">
                    Monthly Volume ({filters.year})
                  </td>
                  {MONTHS.map((m) => (
                    <td key={m} className="border-b border-gray-200 px-2 py-2">
                      <input
                        type="number"
                        value={monthlyValues[m]}
                        onChange={(e) => handleMonthChange(m, e.target.value)}
                        placeholder="0"
                        className="w-20 rounded-md border border-gray-300 px-2 py-1 text-right text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                  ))}
                  <td className="border-b border-gray-200 px-4 py-3 text-right font-semibold text-gray-800">
                    {monthlyTotal.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-indigo-50">
                  <td className="sticky left-0 z-10 border-b border-gray-200 bg-indigo-50 px-4 py-3 font-semibold text-indigo-800">
                    Yearly Subtotal
                  </td>
                  <td
                    colSpan={MONTHS.length}
                    className="border-b border-gray-200 px-4 py-3 text-sm text-indigo-700"
                  >
                    SUM(months) × {WORKING_DAYS_PER_MONTH} working days
                  </td>
                  <td className="border-b border-gray-200 px-4 py-3 text-right font-bold text-indigo-900">
                    {yearlySubtotal.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex items-center justify-between rounded-lg bg-white p-6 shadow">
          <div>
            {statusMessage && (
              <p
                className={`text-sm font-medium ${
                  statusMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {statusMessage.text}
              </p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Forecast'}
          </button>
        </section>
      </div>
    </div>
  );
};

export default ForecastMatrix;