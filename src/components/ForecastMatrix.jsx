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
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSelectionChange = (field, value) => {
    setSelections((prev) => ({ ...prev, [field]: value }));
  };

  const handleMonthChange = (month, value) => {
    setMonthlyValues((prev) => ({ ...prev, [month]: value }));
  };

  const monthlySum = useMemo(() => {
    return MONTHS.reduce((sum, m) => sum + (parseFloat(monthlyValues[m]) || 0), 0);
  }, [monthlyValues]);

  const yearlySubtotal = useMemo(() => monthlySum * WORKING_DAYS, [monthlySum]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      ...selections,
      monthlyValues: MONTHS.reduce((acc, m) => {
        acc[m] = parseFloat(monthlyValues[m]) || 0;
        return acc;
      }, {}),
      monthlySum,
      yearlySubtotal,
      workingDaysPerMonth: WORKING_DAYS,
    };

    try {
      const response = await fetch('http://localhost:8000/api/forecasts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      await response.json().catch(() => ({}));
      setSubmitStatus({ type: 'success', message: 'Forecast submitted successfully.' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: `Submission failed: ${error.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  const renderSelect = (label, field, options) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <select
        value={selections[field]}
        onChange={(e) => handleSelectionChange(field, e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
      <div className="mx-auto max-w-7xl rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Rail Logistics Forecast Matrix</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure forecast parameters and enter monthly production volumes.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {renderSelect('Year', 'year', YEARS)}
          {renderSelect('IPT Team', 'iptTeam', IPT_TEAMS)}
          {renderSelect('Work Section', 'workSection', WORK_SECTIONS)}
          {renderSelect('Work Type', 'workType', WORK_TYPES)}
          {renderSelect('Material Type', 'materialType', MATERIAL_TYPES)}
          {renderSelect('Quarry', 'quarry', QUARRIES)}
          {renderSelect('Gate', 'gate', GATES)}
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Metric
                </th>
                {MONTHS.map((month) => (
                  <th
                    key={month}
                    className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    {month}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                  Daily Volume
                </td>
                {MONTHS.map((month) => (
                  <td key={month} className="px-2 py-2">
                    <input
                      type="number"
                      value={monthlyValues[month]}
                      onChange={(e) => handleMonthChange(month, e.target.value)}
                      placeholder="0"
                      className="w-20 rounded-md border border-gray-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center text-sm font-semibold text-gray-800">
                  {monthlySum.toLocaleString()}
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="sticky left-0 z-10 bg-blue-50 px-4 py-3 text-sm font-semibold text-gray-800">
                  Monthly Subtotal (×{WORKING_DAYS} days)
                </td>
                {MONTHS.map((month) => {
                  const val = (parseFloat(monthlyValues[month]) || 0) * WORKING_DAYS;
                  return (
                    <td key={month} className="px-4 py-3 text-center text-sm text-gray-700">
                      {val.toLocaleString()}
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-center text-sm font-bold text-blue-700">
                  {yearlySubtotal.toLocaleString()}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="sticky left-0 z-10 bg-gray-100 px-4 py-3 text-sm font-bold text-gray-800">
                  Yearly Subtotal
                </td>
                <td
                  colSpan={MONTHS.length}
                  className="px-4 py-3 text-right text-sm text-gray-500"
                >
                  SUM(months) × {WORKING_DAYS} working days
                </td>
                <td className="px-4 py-3 text-center text-base font-bold text-green-700">
                  {yearlySubtotal.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {submitStatus && (
              <p
                className={`text-sm font-medium ${
                  submitStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {submitStatus.message}
              </p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Forecast'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForecastMatrix;