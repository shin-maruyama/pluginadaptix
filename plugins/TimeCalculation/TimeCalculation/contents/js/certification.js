async function KNTP387010certification() {
  const domain = location.hostname.replace('.cybozu.com', '');
  const seihinNo = 'KNTP387010';

  const params = {
    domain,
    seihinNo,
  };

  const query = new URLSearchParams(params).toString();
  const url = `https://aio-ec.jp/kintoneapi/check_plugin_auth.php?${query}`;

  try {
    const resp = await kintone.proxy(url, 'GET', {}, {});
    const { status, message } = JSON.parse(resp[0]);

    if (message) {
      swal.fire({
        title: 'エラー',
        html: message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    if (status) {
      return false;
    }
  } catch (error) {
    swal.fire({
      title: 'エラー',
      html: '認証情報を取得できませんでした。',
      icon: 'error',
      confirmButtonText: 'OK',
    });
    return false;
  }
  return true;
}