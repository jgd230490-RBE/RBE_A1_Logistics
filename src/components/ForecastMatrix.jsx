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
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  const [iptTeam, setIptTeam] = useState(IPT_TEAMS[0]);
  const [workSection, setWorkSection] = useState(WORK_SECTIONS[0]);
  const [workType, setWorkType] = useState(WORK_TYPES[0]);
  const [materialType, setMaterialType] = useState(MATERIAL_TYPES[0]);
  const [quarry, setQuarry] = useState(QUARRIES[0]);
  const [gate, setGate] = useState(GATES[0]);

  const [monthlyValues, setMonthlyValues] = useState(
    MONTHS.reduce((acc, m) => ({ ...acc, [m]: '' }), {})
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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
    setSubmitStatus(null);

    const payload = {
      year: selectedYear,
      iptTeam,
      workSection,
      workType,
      materialType,
      quarry,
      gate,
      monthlyValues: MONTHS.reduce(
        (acc, m) => ({ ...acc, [m]: parseFloat(monthlyValues[m]) || 0 }),
        {}
      ),
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

      await response.json().catch(() => ({}));
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
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      <div className="mx-auto max-w-7xl rounded-lg bg-white shadow-md">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Rail Logistics Forecasting Platform
          </h1>
          <p className="text-sm text-gray-500">
            Configure forecast parameters and enter monthly volumes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {renderSelect('Year', selectedYear, (v) => setSelectedYear(Number(v)), YEARS)}
          {renderSelect('IPT Team', iptTeam, setIptTeam, IPT_TEAMS)}
          {renderSelect('Work Section', workSection, setWorkSection, WORK_SECTIONS)}
          {renderSelect('Work Type', workType, setWorkType, WORK_TYPES)}
          {renderSelect('Material Type', materialType, setMaterialType, MATERIAL_TYPES)}
          {renderSelect('Quarry', quarry, setQuarry, QUARRIES)}
          {renderSelect('Gate', gate, setGate, GATES)}
        </div>

        <div className="overflow-x-auto px-6 pb-6">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                  Metric
                </th>
                {MONTHS.map((m) => (
                  <th
                    key={m}
                    className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-700"
                  >
                    {m}
                  </th>
                ))}
                <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-700">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium text-gray-700">
                  Monthly Volume
                </td>
                {MONTHS.map((m) => (
                  <td key={m} className="border border-gray-200 px-1 py-1">
                    <input
                      type="number"
                      value={monthlyValues[m]}
                      onChange={(e) => handleMonthChange(m, e.target.value)}
                      className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </td>
                ))}
                <td className="border border-gray-200 px-3 py-2 text-right font-semibold text-gray-800">
                  {monthlySum.toLocaleString()}
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-gray-200 px-3 py-2 font-semibold text-gray-800">
                  Yearly Subtotal
                </td>
                <td
                  className="border border-gray-200 px-3 py-2 text-right font-bold text-blue-700"
                  colSpan={MONTHS.length + 1}
                >
                  {yearlySubtotal.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-gray-500">
                    (Sum × {WORKING_DAYS_PER_MONTH} working days)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end gap-3 border-t border-gray-200 px-6 py-4">
          {submitStatus && (
            <div
              className={`w-full rounded-md px-4 py-2 text-sm ${
                submitStatus.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {submitting ? 'Submitting...' : 'Submit Forecast'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForecastMatrix;