import React, { useEffect, useState } from 'react';
import './Popup.css';
import numeral from 'numeral';

const Popup = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch(
        'https://gold-api-wheat.vercel.app/api/gold-data'
      );
      const data = await response.json();
      setData(data.goldPrices);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const goldBar = data?.find((d) => d.title === 'ทองคำแท่ง');
  const goldOrnament = data?.find((d) => d.title === 'ทองรูปพรรณ');
  const goldTodayTrend = data?.find((d) => d.title?.includes('วันนี้'));
  const goldUpdatedAt = data?.find((d) => d.data1?.includes('เวลา'));

  if (goldOrnament?.data2) {
    chrome.action.setBadgeText({
      text: numeral(goldOrnament?.data2).format('0.0a', Math.floor),
    });
    chrome.action.setBadgeBackgroundColor({ color: '#ffdb19' });
  }

  return (
    <div className="content">
      {loading && !data && (
        <div className="loading-content">
          <p style={{ color: '#2c3e50' }}>กำลังอัพเดทข้อมูล...</p>
          <p style={{ color: '#636e72' }}>ราคาทองตามประกาศสมาคมค้าทองคำ</p>
        </div>
      )}
      {data && (
        <table className="data-table">
          <thead>
            <tr>
              <th>96.5%</th>
              <th>รับซื้อ</th>
              <th>ขายออก</th>
            </tr>
          </thead>
          <tbody>
            {goldBar && (
              <tr>
                <td className="title">{goldBar?.title}</td>
                <td>{goldBar?.data1}</td>
                <td>{goldBar?.data2}</td>
              </tr>
            )}

            {goldOrnament && (
              <tr>
                <td className="title">{goldOrnament?.title}</td>
                <td>{goldOrnament?.data1}</td>
                <td>{goldOrnament?.data2}</td>
              </tr>
            )}

            {goldTodayTrend && (
              <tr>
                <td className="title">{goldTodayTrend?.title}</td>
                <td colSpan="2">{goldTodayTrend?.data2}</td>
              </tr>
            )}

            {goldUpdatedAt && (
              <tr>
                <td colSpan="3">
                  {goldUpdatedAt?.title} {goldUpdatedAt?.data1}{' '}
                  {goldUpdatedAt?.data2}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Popup;
