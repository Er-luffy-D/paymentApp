export const InputBox = ({ label, placeholder, onChange }) => {
    return (
        <div>
            <div className="text-sm font-medium text-left py-2">
                {label}
            </div>
            <div>
                <input onChange={onChange} type="text" className="w-full px-2 py-1 border rounded border-slate-200" placeholder={placeholder} />
            </div>
        </div>
    )
}
