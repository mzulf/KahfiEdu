import { render, screen } from '@testing-library/react'
import UserTable from '../components/Admin/user/UserTable'

describe('UserTable', () => {
    const dummyData = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '123456',
            role: { name: 'student' },
            formattedDeletedAt: null,
            deletedAt: null
        }
    ]

    const noop = () => { }

    it('should render table rows with user data', () => {
        render(
            <UserTable
                data={dummyData}
                page={0}
                rowsPerPage={10}
                totalRows={1}
                handleChangePage={noop}
                handleChangeRowsPerPage={noop}
                handleDelete={noop}
                handleRestore={noop}
                handleDetail={noop}
            />
        )

        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('john@example.com')).toBeInTheDocument()
        expect(screen.getByText('123456')).toBeInTheDocument()
        expect(screen.getByText('student')).toBeInTheDocument()
    })

    it('should show no data text when empty', () => {
        render(
            <UserTable
                data={[]}
                page={0}
                rowsPerPage={10}
                totalRows={0}
                handleChangePage={noop}
                handleChangeRowsPerPage={noop}
                handleDelete={noop}
                handleRestore={noop}
                handleDetail={noop}
            />
        )

        expect(screen.getByText(/tidak ada data tersedia/i)).toBeInTheDocument()
    })
})
