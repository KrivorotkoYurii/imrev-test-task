/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import styles from './styles/App.module.scss';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStarage';
import { Loader } from './components/Loader';

export const App: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityToDeliver, setCityToDeliver] = useLocalStorage(
    'cityDeliver',
    'Місто ще не обране',
  );
  const [warehouseToDeliver, setWareHouseToDeliver] = useLocalStorage(
    'warehouseToDeliver',
    'Відділення ще не обране',
  );
  const [cities, setCities] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [selectedCityRef, setSelectedCityRef] = useState<string | null>(null);

  const apiKey = '77dbb746524ffeb5155e88780b05efd8';

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('Ви не авторизовані');
        setLoading(false);

        return;
      }

      try {
        const response = await fetch(
          'https://front-test.imrev.com.ua/api/v1/profile',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setUserData(data.result);
          setFormData(data.result);
        } else {
          setError(data.message || 'Не вдалося завантажити профіль');
        }
      } catch (err) {
        setError('Помилка підключення до сервера');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey,
            modelName: 'Address',
            calledMethod: 'getCities',
            methodProperties: {
              CityName: '',
            },
          }),
        });
        const data = await response.json();

        if (data.success) {
          setCities(data.data);
        } else {
          setError('Помилка завантаження міст');
        }
      } catch (err) {
        setError('Помилка з’єднання з сервером');
      }
    };

    fetchCities();
  }, [apiKey]);

  // Отримання відділень для вибраного міста
  useEffect(() => {
    if (selectedCityRef) {
      const fetchWarehouses = async () => {
        try {
          const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              apiKey,
              modelName: 'Address',
              calledMethod: 'getWarehouses',
              methodProperties: {
                CityRef: selectedCityRef,
              },
            }),
          });
          const data = await response.json();

          if (data.success) {
            setWarehouses(data.data);
          } else {
            setError('Помилка завантаження відділень');
          }
        } catch (err) {
          setError('Помилка з’єднання з сервером');
        }
      };

      fetchWarehouses();
    }
  }, [selectedCityRef, apiKey]);

  // Обробка зміни в input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const ourCity = cities.find(town => town.Ref === selectedCityRef);

  const ourWarhouse = warehouses.find(
    wareHouse => wareHouse.Ref === selectedWarehouse,
  );

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Ви не авторизовані');

      return;
    }

    const toUpdate = {
      city: ourCity?.Ref,
      city_guid: ourCity?.CityID,
      warehouse: selectedWarehouse,
      warehouse_guid: ourWarhouse?.WarehouseIndex,
    };

    // const shipment =
    //   selectedCityRef !== '' && selectedWarehouse !== '' ? toUpdate : null;

    const body = {
      ...formData,
      shipment: toUpdate,
    };

    try {
      const response = await fetch(
        'https://front-test.imrev.com.ua/api/v1/profile/update',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setUserData(formData);
        setIsEditing(false);
        setCityToDeliver(ourCity.Description);
        setWareHouseToDeliver(ourWarhouse.Description);
        alert('Зміни збережено!');
      } else {
        alert(data.message || 'Помилка збереження');
      }
    } catch (err) {
      alert('Помилка підключення до сервера');
    }
  };

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.header}>Профіль користувача</h1>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Вийти
      </button>

      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>Персональні дані</h2>
        <div className={styles.field}>
          <label className={styles.label}>Ім&apos;я:</label>
          {isEditing ? (
            <input
              className={styles.input}
              name="first_name"
              value={formData?.first_name || ''}
              onChange={handleInputChange}
            />
          ) : (
            <span className={styles.value}>{userData?.first_name}</span>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Прізвище:</label>
          {isEditing ? (
            <input
              className={styles.input}
              name="last_name"
              value={formData?.last_name || ''}
              onChange={handleInputChange}
            />
          ) : (
            <span className={styles.value}>{userData?.last_name}</span>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Електронна пошта:</label>
          <span className={styles.value}>{userData?.email}</span>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Телефон:</label>
          {isEditing ? (
            <input
              className={styles.input}
              name="phone"
              value={formData?.phone || ''}
              onChange={handleInputChange}
            />
          ) : (
            <span className={styles.value}>{userData?.phone}</span>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>Адреса доставки</h2>
        <div className={styles.field}>
          <label className={styles.label}>Місто:</label>
          {isEditing ? (
            <select
              onChange={e => setSelectedCityRef(e.target.value)}
              value={selectedCityRef || ''}
            >
              <option value="">Виберіть місто</option>
              {cities.map((city: any) => (
                <option key={city.Ref} value={city.Ref}>
                  {city.Description}
                </option>
              ))}
            </select>
          ) : (
            <span className={styles.value}>{cityToDeliver}</span>
          )}
        </div>

        {cityToDeliver !== 'Місто ще не обране' && (
          <div className={styles.field}>
            <label className={styles.label}>Відділення:</label>
            {isEditing ? (
              <select
                onChange={e => setSelectedWarehouse(e.target.value)}
                value={selectedWarehouse || ''}
              >
                <option value="">Виберіть відділення</option>
                {warehouses.map((warehouse: any) => (
                  <option key={warehouse.Ref} value={warehouse.Ref}>
                    {warehouse.Description}
                  </option>
                ))}
              </select>
            ) : (
              <span className={styles.value}>{warehouseToDeliver}</span>
            )}
          </div>
        )}

        {isEditing ? (
          <button className={styles.editButton} onClick={handleSave}>
            Зберегти зміни
          </button>
        ) : (
          <button className={styles.editButton} onClick={handleEditToggle}>
            Редагувати
          </button>
        )}
      </section>
    </div>
  );
};
