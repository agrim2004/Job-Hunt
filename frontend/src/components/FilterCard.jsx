import { useDispatch, useSelector } from 'react-redux'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import {
    setSelectedLocation,
    setSelectedRole,
    setSelectedSalary
} from '@/redux/jobSlice'

const filterData = [
    {
        filterType: 'Location',
        array: ['Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai']
    },
    {
        filterType: 'Job Role',
        array: [
            'Frontend Developer',
            'Backend Developer',
            'FullStack Developer'
        ]
    },
    {
        filterType: 'Salary',
        array: [
            '0-3 LPA',
            '3-5 LPA',
            '5-8 LPA',
            '8-12 LPA',
            '12-20 LPA',
            '20+ LPA'
        ]
    }
]

const FilterCard = () => {
    const dispatch = useDispatch()

    const { selectedLocation, selectedRole, selectedSalary } =
        useSelector(store => store.job)

    const selectedValues = {
        Location: selectedLocation,
        'Job Role': selectedRole,
        Salary: selectedSalary
    }

    const actions = {
        Location: setSelectedLocation,
        'Job Role': setSelectedRole,
        Salary: setSelectedSalary
    }

    return (
        <div className="w-full bg-white p-3 rounded-md">
            <h1 className="font-bold text-lg">Filter Jobs</h1>
            <hr className="mt-3" />

            {filterData.map(data => (
                <div key={data.filterType} className="mt-4">
                    <h2 className="font-bold text-lg">
                        {data.filterType}
                    </h2>

                    <RadioGroup
                        value={selectedValues[data.filterType]}
                        onValueChange={value =>
                            dispatch(actions[data.filterType](value))
                        }
                    >
                        {data.array.map(item => (
                            <div
                                key={item}
                                className="flex items-center space-x-2 my-2"
                            >
                                <RadioGroupItem
                                    value={item}
                                    id={`${data.filterType}-${item}`}
                                />
                                <Label htmlFor={`${data.filterType}-${item}`}>
                                    {item}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>

                    <button
                        type="button"
                        className="text-sm text-blue-600 mt-1"
                        onClick={() =>
                            dispatch(actions[data.filterType](''))
                        }
                    >
                        Clear {data.filterType}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default FilterCard
