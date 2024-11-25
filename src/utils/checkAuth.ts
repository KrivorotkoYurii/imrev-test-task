export const checkAuth = async (token: string) => {
  const url = new URL('https://front-test.imrev.com.ua/api/v1/profile');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const response = await fetch(url, { method: 'GET', headers });
    const data = await response.json();

    if (response.status === 200) {
      return data.result;
    } else {
      throw new Error(data.message || 'Неавторизований');
    }
  } catch (error) {
    throw new Error('Помилка при перевірці авторизації');
  }
};
