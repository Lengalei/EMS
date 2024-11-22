// EmployeeProfile.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Employee/EmployeeProfile.scss';
import apiRequest from '../../lib/apiRequest';

const EmpProfile = () => {
  const { id } = useParams(); // Get employee ID from URL
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await apiRequest.get(`/employee/employees/${id}`);
        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    fetchEmployee();
  }, [id]);

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="employee-profile">
      <div className="profile-header">
        <img
          src={employee.image || '/default-avatar.jpg'}
          alt={employee.name}
          className="profile-image"
        />
        <div className="profile-details">
          <h2>{employee.name}</h2>
          <p>
            <strong>Department:</strong> {employee.department}
          </p>
          <p>
            <strong>Email:</strong> {employee.email || 'example@gmail.com'}
          </p>
          <p>
            <strong>Phone:</strong> {employee.phone}
          </p>
          <p>
            <strong>Address:</strong> {employee.address}
          </p>
          <p>
            <strong>Join Date:</strong>{' '}
            {new Date(employee.joinDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Position:</strong> {employee.position}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmpProfile;
