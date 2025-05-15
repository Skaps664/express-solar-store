export default function ProductSpecifications({ specifications }) {
  return (
    <div className="space-y-8">
      {Object.entries(specifications).map(([category, specs]) => (
        <div key={category}>
          <h3 className="text-lg font-bold mb-4">{category}</h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <tbody>
                {Object.entries(specs).map(([key, value], index) => (
                  <tr
                    key={key}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-colors`}
                  >
                    <td className="py-3 px-4 border-b border-gray-200 font-medium">{key}</td>
                    <td className="py-3 px-4 border-b border-gray-200">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
