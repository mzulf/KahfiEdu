import { render, screen, fireEvent } from '@testing-library/react';
import UserFilterTable from '@componentsAdmin/user/UserFilterTable';
import '@testing-library/jest-dom';

describe('UserFilterTable', () => {
    const mockRoles = [
        { id: 'admin', name: 'admin' },
        { id: 'student', name: 'student' },
    ];

    const setup = () => {
        const handleStatusChange = vi.fn();
        const handleRoleChange = vi.fn();
        const handleSearch = vi.fn();

        render(
            <UserFilterTable
                roles={mockRoles}
                status="all"
                selectedRoleId=""
                handleStatusChange={handleStatusChange}
                handleRoleChange={handleRoleChange}
                handleSearch={handleSearch}
            />
        );

        return {
            handleStatusChange,
            handleRoleChange,
            handleSearch,
        };
    };

    it('renders status and role selects and search input', () => {
        setup();
        expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Cari nama/i)).toBeInTheDocument();
    });

    it('calls handleStatusChange on status change', () => {
        const { handleStatusChange } = setup();
        fireEvent.mouseDown(screen.getByLabelText(/Status/i));
        fireEvent.click(screen.getByText('Active'));
        expect(handleStatusChange).toHaveBeenCalled();
    });

    it('calls handleRoleChange on role change', () => {
        const { handleRoleChange } = setup();
        fireEvent.mouseDown(screen.getByLabelText(/Role/i));
        fireEvent.click(screen.getByText('Student'));
        expect(handleRoleChange).toHaveBeenCalled();
    });

    it('calls handleSearch on input change', () => {
        const { handleSearch } = setup();
        fireEvent.change(screen.getByPlaceholderText(/Cari nama/i), {
            target: { value: 'Teacher' }
        });
        expect(handleSearch).toHaveBeenCalledWith('Teacher');
    });
});
