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
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  const [iptTeam, setIptTeam] = useState(IPT_TEAMS[0]);
  const [workSection, setWorkSection] = useState(WORK_SECTIONS[0]);
  const [workType, setWorkType] = useState(WORK_TYPES[0]);
  const [materialType, setMaterialType] = useState(MATERIAL_TYPES[0]);
  const [quarry, setQuarry] = useState(QUARRIES[0]);
  const [gate, setGate] = useState(GATES[0]);

  const [monthlyValues, setMonthlyValues] = useState(
    MONTHS.reduce((acc, m) => ({ ...acc, [m]: 0 }), {})
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleMonthChange = (month, value) => {
    const numeric = value === '' ? 0 : parseFloat(value);
    setMonthlyValues((prev) => ({
      ...prev,
      [month]: isNaN(numeric) ? 0 : numeric,
    }));
  };

  const monthlySum = useMemo(
    () => MONTHS.reduce((sum, m) => sum + (Number(monthlyValues[m]) || 0), 0),
    [monthlyValues]
  );

  const yearlySubtotal = useMemo(
    () => monthlySum * WORKING_DAYS_PER_MONTH,
    [monthlySum]
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      year: selectedYear,
      iptTeam,
      workSection,
      workType,
      materialType,
      quarry,
      gate,
      monthlyValues,
      monthlySum,
      yearlySubtotal,
      workingDaysPerMonth: WORKING_DAYS_PER_MONTH,
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

      await response.json().catch(() => null);
      setSubmitStatus({ type: 'success', message: 'Forecast submitted successfully.' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: `Submission failed: ${error.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  const renderSelect = (label, value, onChange, options) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rail Logistics Forecast Matrix</h1>
        <p className="mt-1 text-sm text-gray-500">
          Plan and submit monthly material forecasts. Yearly subtotal assumes {WORKING_DAYS_PER_MONTH} working days per month.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {renderSelect('Year', selectedYear, (v) => setSelectedYear(Number(v)), YEARS)}
        {renderSelect('IPT Team', iptTeam, setIptTeam, IPT_TEAMS)}
        {renderSelect('Work Section', workSection, setWorkSection, WORK_SECTIONS)}
        {renderSelect('Work Type', workType, setWorkType, WORK_TYPES)}
        {renderSelect('Material Type', materialType, setMaterialType, MATERIAL_TYPES)}
        {renderSelect('Quarry', quarry, setQuarry, QUARRIES)}
        {renderSelect('Gate', gate, setGate, GATES)}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="sticky left-0 z-10 bg-gray-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Metric
              </th>
              {MONTHS.map((m) => (
                <th
                  key={m}
                  className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600"
                >
                  {m}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-gray-900">
                Monthly Volume
              </td>
              {MONTHS.map((m) => (
                <td key={m} className="px-2 py-2 text-center">
                  <input
                    type="number"
                    value={monthlyValues[m]}
                    onChange={(e) => handleMonthChange(m, e.target.value)}
                    className="w-20 rounded-md border border-gray-300 px-2 py-1 text-right text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              ))}
              <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                {monthlySum.toLocaleString()}
              </td>
            </tr>
            <tr className="bg-blue-50">
              <td className="sticky left-0 z-10 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">
                Yearly Subtotal
              </td>
              <td
                colSpan={MONTHS.length}
                className="px-4 py-3 text-center text-sm text-blue-700"
              >
                SUM(months) × {WORKING_DAYS_PER_MONTH} working days
              </td>
              <td className="px-4 py-3 text-center text-sm font-bold text-blue-900">
                {yearlySubtotal.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Forecast'}
        </button>
      </div>
    </div>
  );
};

export default ForecastMatrix;