import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import CryptoLineChart from "./CryptoLineChart";
import USDLineChart from "./USDLineChart";

function App() {
  // State for total money (player earnings in USD)
  const [totalUSD, setTotalUSD] = useState(1000);

  // State for specific cryptocurrency balances
  const [cryptoBalances, setCryptoBalances] = useState({
    Bitcoin: 0,
    Ethereum: 0,
    Dogecoin: 0,
    XRP: 0,
    Tron: 0,
    Pepe: 0,
    Shiba: 0,
    Litecoin: 0,
    Cardano: 0,
  });

  // State to track initial investment amounts
  const [initialInvestments, setInitialInvestments] = useState({
    Bitcoin: 0,
    Ethereum: 0,
    Dogecoin: 0,
    XRP: 0,
    Tron: 0,
    Pepe: 0,
    Shiba: 0,
    Litecoin: 0,
    Cardano: 0,
  });

  // State for crypto prices
  const [cryptoPrices, setCryptoPrices] = useState({
    Bitcoin: 12000,
    Ethereum: 2000,
    XRP: 30,
    Dogecoin: 0.1,
    Tron: 0.2,
    Pepe: 0.1,
    Shiba: 0.1,
    Litecoin: 107,
    Cardano: 0.9,
  });

  const [cryptoPriceHistory, setCryptoPriceHistory] = useState({
    Bitcoin: [],
    Ethereum: [],
    Dogecoin: [],
    XRP: [],
    Tron: [],
    Pepe: [],
    Shiba: [],
    Litecoin: [],
    Cardano: [],
  });

  const [usdHistory, setUsdHistory] = useState([]);
  const [investedHistory, setInvestedHistory] = useState([]); // ✅ Track investment history

  // State for news events
  const [newsEvent, setNewsEvent] = useState({ message: null, effect: {} });
  const [visible, setVisible] = useState(false);
  const [posts, setPosts] = useState([]);

  // Ref to store previous prices
  const prevPricesRef = useRef(cryptoPrices);

  useEffect(() => {
    const priceFluctuationInterval = setInterval(() => {
      setCryptoPrices((prevPrices) => {
        const newPrices = {};
        const updatedHistory = { ...cryptoPriceHistory };

        for (const [coin, price] of Object.entries(prevPrices)) {
          const changePercent = (Math.random() * 10 - 5) / 100; // Simulate -5% to +5% fluctuation
          const newPrice = price + price * changePercent;
          newPrices[coin] = Math.max(newPrice, 0.01);

          // Update price history
          updatedHistory[coin] = [...(updatedHistory[coin] || []), { time: Date.now(), price: newPrice }];

          // Limit the array to the last 30 data points
          if (updatedHistory[coin].length > 30) {
            updatedHistory[coin] = updatedHistory[coin].slice(-30);
          }
        }

        // ** Update previous prices BEFORE updating state **
        prevPricesRef.current = prevPrices;

        setCryptoPriceHistory(updatedHistory);
        return newPrices;
      });
    }, 1000);

    return () => clearInterval(priceFluctuationInterval);
  }, [cryptoPriceHistory]);

  useEffect(() => {
    const newsInterval = setInterval(() => {
      const events = [
        { message: "Major company invests in Bitcoin!", effect: { Bitcoin: [0.1, 0.3] } },
        { message: "Ethereum network faces technical issues.", effect: { Ethereum: [-0.2, -0.1] } },
        { message: "Dogecoin gains popularity on social media!", effect: { Dogecoin: [0.2, 0.5] } },
        {
          message: "Global regulations tighten on cryptocurrencies.",
          effect: { Bitcoin: [-0.15, -0.05], Ethereum: [-0.15, -0.05], Dogecoin: [-0.15, -0.05] },
        },
        { message: "New blockchain technology boosts Cardano!", effect: { Cardano: [0.2, 0.4] } },
        { message: "Bitcoin ETF gets approved!", effect: { Bitcoin: [0.3, 0.5] } },
        { message: "Elon Musk tweets about Dogecoin again!", effect: { Dogecoin: [0.25, 0.4] } },
        { message: "Federal Reserve announces interest rate hike.", effect: { Bitcoin: [-0.2, -0.1], Ethereum: [-0.2, -0.1] } },
        { message: "Shiba Inu launches a new decentralized exchange.", effect: { Shiba: [0.2, 0.5] } },
        { message: "Institutional investors increase Bitcoin holdings.", effect: { Bitcoin: [0.15, 0.3] } },
        { message: "Ripple wins key lawsuit over XRP classification.", effect: { XRP: [0.2, 0.4] } },
        { message: "Ethereum completes a successful network upgrade.", effect: { Ethereum: [0.2, 0.4] } },
        { message: "China eases crypto mining restrictions.", effect: { Bitcoin: [0.1, 0.25], Ethereum: [0.1, 0.25] } },
        { message: "Litecoin adoption grows among online retailers.", effect: { Litecoin: [0.15, 0.3] } },
        { message: "SEC delays decision on Bitcoin ETF approval.", effect: { Bitcoin: [-0.2, -0.1] } },
        { message: "Tesla announces acceptance of Bitcoin for payments.", effect: { Bitcoin: [0.25, 0.4] } },
      ];

      const randomEvent = events[Math.floor(Math.random() * events.length)];

      const effects = Object.fromEntries(
        Object.entries(randomEvent.effect).map(([coin, range]) => {
          const randomPercent = Math.random() * (range[1] - range[0]) + range[0];
          return [coin, randomPercent];
        })
      );

      // Show the news event
      setNewsEvent({ message: randomEvent.message, effects });
      setVisible(true);

      setCryptoPrices((prevPrices) => {
        const newPrices = { ...prevPrices };
        for (const [coin, percent] of Object.entries(effects)) {
          newPrices[coin] = Math.max(newPrices[coin] + newPrices[coin] * percent, 0.01);
        }
        return newPrices;
      });

      // Hide the news event after 5 seconds
      const hideTimeout = setTimeout(() => {
        setVisible(false); // Trigger hide animation
        const clearEventTimeout = setTimeout(() => {
          setNewsEvent({ message: null, effects: {} }); // Clear message after hide animation
        }, 500); // Match the duration of the slide-up animation
        return () => clearTimeout(clearEventTimeout);
      }, 5000);

      return () => clearTimeout(hideTimeout); // Cleanup timeout
    }, 15000); // Trigger a news event every 15 seconds

    return () => clearInterval(newsInterval);
  }, []);

  useEffect(() => {
    const socialInterval = setInterval(() => {
      const postsData = [
        {
          name: "CryptoWhale99",
          profilePic: "/images/user1.png",
          message: "Just bought 1,000 BTC! 🚀",
          image: "/images/post1.png",
          coinEffect: "Bitcoin",
          priceImpactRange: [0.1, 0.3],
        },
        {
          name: "InvestorBear",
          profilePic: "/images/user2.png",
          message: "Selling all my ETH... this market is scary 😨",
          image: "/images/post2.png",
          coinEffect: "Ethereum",
          priceImpactRange: [-0.2, -0.1],
        },
        {
          name: "DogeFan",
          profilePic: "/images/user3.png",
          message: "DOGE TO THE MOON! 🌕🚀",
          image: "/images/post3.png",
          coinEffect: "Dogecoin",
          priceImpactRange: [0.2, 0.5],
        },
        {
          name: "RegulatoryNews",
          profilePic: "/images/user4.png",
          message: "Governments tightening crypto regulations...",
          image: "/images/post4.png",
          coinEffect: "Bitcoin",
          priceImpactRange: [-0.15, -0.05],
        },
        {
          name: "TechGuru",
          profilePic: "/images/user5.png",
          message: "Ethereum's latest upgrade is a game-changer! 🔥",
          image: "/images/post5.png",
          coinEffect: "Ethereum",
          priceImpactRange: [0.2, 0.4],
        },
      ];

      const randomPost = postsData[Math.floor(Math.random() * postsData.length)];
      const priceImpact = Math.random() * (randomPost.priceImpactRange[1] - randomPost.priceImpactRange[0]) + randomPost.priceImpactRange[0];

      const newPost = {
        id: Date.now(),
        name: randomPost.name,
        profilePic: randomPost.profilePic,
        message: randomPost.message,
        likes: Math.floor(Math.random() * 5000) + 1, // Random likes count
        coinEffect: randomPost.coinEffect,
        priceImpact,
      };

      setPosts((prevPosts) => [newPost, ...prevPosts.slice(0, 7)]); // Keep the latest 8 posts

      // Update coin prices
      setCryptoPrices((prevPrices) => {
        const newPrices = { ...prevPrices };
        if (newPrices[newPost.coinEffect]) {
          newPrices[newPost.coinEffect] = Math.max(newPrices[newPost.coinEffect] + newPrices[newPost.coinEffect] * priceImpact, 0.01);
        }
        return newPrices;
      });
    }, 25000); // Every 15 seconds

    return () => clearInterval(socialInterval);
  }, []);

  useEffect(() => {
    setCryptoPrices((prevPrices) => {
      const newPrices = { ...prevPrices };

      posts.forEach((post) => {
        if (newPrices[post.coinEffect]) {
          const changeAmount = newPrices[post.coinEffect] * (post.priceImpact / 100);
          newPrices[post.coinEffect] += changeAmount;
        }
      });

      return newPrices;
    });
  }, [posts]); // Re-run effect when posts change

  const sellCrypto = (coin) => {
    setCryptoBalances((prevBalances) => {
      const balanceToSell = prevBalances[coin]; // Get balance to sell
      if (balanceToSell <= 0) return prevBalances; // Prevent selling if balance is zero

      const usdValue = balanceToSell * cryptoPrices[coin]; // Convert crypto to USD

      return { ...prevBalances, [coin]: 0 }; // Reset balance for this coin
    });

    setInitialInvestments((prevInvestments) => ({
      ...prevInvestments,
      [coin]: 0, // Reset investment tracking
    }));

    setTotalUSD((prevUSD) => {
      const newTotalUSD = prevUSD + cryptoBalances[coin] * cryptoPrices[coin]; // ✅ Ensures single update
      return newTotalUSD;
    });
  };

  const investInCrypto = (coin, amount) => {
    const amountNum = parseFloat(amount); // Ensure the input is a number
    console.log(amountNum);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > totalUSD) {
      alert("Invalid amount. Please enter a value greater than 0 and within your available balance.");
      return;
    }

    setCryptoBalances((prevBalances) => ({
      ...prevBalances,
      [coin]: (prevBalances[coin] || 0) + amountNum / cryptoPrices[coin],
    }));

    setInitialInvestments((prevInvestments) => ({
      ...prevInvestments,
      [coin]: (prevInvestments[coin] || 0) + amountNum,
    }));

    setTotalUSD((prevUSD) => prevUSD - amountNum); // Deduct from total balance
  };

  // ✅ Calculate total invested value
  const totalInvested = Object.entries(cryptoBalances).reduce((acc, [coin, balance]) => acc + balance * cryptoPrices[coin], 0);

  // ✅ Compute fluctuating net worth
  const totalNetWorth = totalUSD + totalInvested;

  useEffect(() => {
    setUsdHistory((prevHistory = []) => [
      ...prevHistory.slice(-30), // ✅ Keeps only last 30 data points
      { time: Date.now(), usd: totalNetWorth },
    ]);
  
    setInvestedHistory((prevHistory = []) => [
      ...prevHistory.slice(-30),
      { time: Date.now(), invested: totalInvested > 0 ? totalInvested : totalUSD }, // ✅ Prevents history from resetting incorrectly
    ]);
  }, [totalNetWorth, totalInvested, totalUSD]);
  

  const getPercentageChange = (coin) => {
    const currentValue = cryptoBalances[coin] * cryptoPrices[coin];
    const initialInvestment = initialInvestments[coin];

    // If the balance is zero, reset percentage to 0%
    if (cryptoBalances[coin] === 0) {
      return 0;
    }

    if (initialInvestment === 0) {
      return 0; // Avoid division by zero
    }

    return ((currentValue - initialInvestment) / initialInvestment) * 100;
  };

  return (
    <div className="App">
      <main>
        <div>
          <section className="crypto-prices">
            <ul className="prices-box">
              {Object.entries(cryptoPrices).map(([coin, price]) => {
                const prevPrice = prevPricesRef.current[coin];
                const isPriceUp = price >= prevPrice;
                return (
                  <li key={coin} className="coin-price">
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <img
                        src={`/images/${coin.toLowerCase()}.png`}
                        alt={coin}
                        style={{
                          width: "24px",
                          height: "28px",
                          objectFit: "contain",
                        }}
                        className="comp"
                      />
                      <p style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{coin} </p>
                      {isPriceUp ? <span className="arrow-up"></span> : <span className="arrow-down"></span>}
                      <p
                        key={coin}
                        style={{
                          color: isPriceUp ? "#16C784" : "#ea3943",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}>
                        ${price.toFixed(2)}
                      </p>
                    </div>
                    {cryptoPriceHistory[coin] && <CryptoLineChart key={coin} coin={coin} priceHistory={cryptoPriceHistory[coin]} />}
                  </li>
                );
              })}
            </ul>
            <ul className="prices-box">
              {Object.entries(cryptoPrices).map(([coin, price]) => {
                const prevPrice = prevPricesRef.current[coin];
                const isPriceUp = price >= prevPrice;
                return (
                  <li key={coin} className="coin-price">
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <img
                        src={`/images/${coin.toLowerCase()}.png`}
                        alt={coin}
                        style={{
                          width: "24px",
                          height: "28px",
                          objectFit: "contain",
                        }}
                        className="comp"
                      />
                      <p style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{coin} </p>
                      {isPriceUp ? <span className="arrow-up"></span> : <span className="arrow-down"></span>}
                      <p
                        key={coin}
                        style={{
                          color: isPriceUp ? "#16C784" : "#ea3943",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}>
                        ${price.toFixed(2)}
                      </p>
                    </div>
                    {cryptoPriceHistory[coin] && <CryptoLineChart key={coin} coin={coin} priceHistory={cryptoPriceHistory[coin]} />}
                  </li>
                );
              })}
            </ul>
          </section>

          <div className={`news-event-container ${visible ? "show" : "hide"}`} aria-hidden={!visible}>
            {newsEvent.message && (
              <section className="news-event">
                <img
                  src="/images/breaking.svg"
                  alt="USD Token"
                  style={{
                    height: "44px",
                  }}
                />
                <h3>
                  <b>{newsEvent.message}</b>
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {Object.entries(newsEvent.effects).map(([coin, percent]) => (
                    <div key={coin} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <img
                        src={`/images/${coin.toLowerCase()}.png`}
                        alt={coin}
                        style={{
                          width: "24px",
                          height: "28px",
                          objectFit: "contain",
                        }}
                        className="comp"
                      />
                      <p style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{coin}:</p>
                      {percent > 0 ? <span class="arrow-up"></span> : <span class="arrow-down"></span>}
                      <p
                        key={coin}
                        style={{
                          color: percent > 0 ? "#16C784" : "#ea3943",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}>
                        {(percent * 100).toFixed(2)}%
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
        <section className="content" style={{ display: "flex" }}>
          <div className="social-media">
            <h2 style={{ color: "white", marginLeft: "30px", marginTop: "80px" }}>CryptoFeed</h2>
            <div className="social-feed">
              {posts.map((post) => (
                <div key={post.id} className="post">
                  <div className="post-content">
                    <span style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "6px" }}>
                      <img src={post.profilePic} alt={post.name} className="profile-pic" />
                      <h4>{post.name}</h4>
                    </span>
                    <p style={{ marginBottom: "10px" }}>{post.message}</p>
                    <img src={post.image} alt={post.image} className="post-pic" />
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <span className="likes">❤️ {post.likes.toLocaleString()}</span>
                      <span className="coin-effect">
                        <img
                          src={`/images/${post.coinEffect.toLowerCase()}.png`}
                          alt={post.coinEffect}
                          style={{
                            width: "24px",
                            height: "28px",
                            objectFit: "contain",
                          }}
                          className="comp"
                        />
                        <p>{(post.priceImpact * 100).toFixed(2)}%</p>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <section className="crypto-balances">
            <div className="balances">
              <span className="coin-balance">
                <p>
                  Buying Power: <b>${totalUSD.toFixed(2)}</b>
                </p>
              </span>
              <div className="person-chart">
                <h2>
                <img
                  src="/images/usd.png"
                  alt="USD Token"
                  style={{
                    width: "44px",
                    height: "48px",
                  }}
                  className="comp"
                />
                  <b>${(totalUSD + totalInvested).toFixed(2)}</b>
                </h2>
                <div style={{marginTop: '40px'}}>
                <USDLineChart usdHistory={investedHistory} />
                </div>
              </div>
              {Object.entries(cryptoBalances).map(([coin, balance]) => {
                const percentageChange = getPercentageChange(coin);
                const currentPrice = cryptoPrices[coin]; // Get the current price of the coin

                return (
                  <span key={coin} className="coin-balance">
                    <div style={{ display: "flex", gap: "10px", width: "128px", alignItems: "center" }}>
                      <img
                        src={`/images/${coin.toLowerCase()}.png`}
                        alt={coin}
                        style={{
                          width: "44px",
                          height: "48px",
                        }}
                        className="comp"
                      />
                      <p style={{ fontWeight: "600" }}>{coin}</p>
                      <p style={{ fontSize: "14px", fontWeight: "500", color: "#ffffff75" }}>${currentPrice.toFixed(2)}</p>
                    </div>
                    <div style={{ display: "flex" }}>
                      <p>
                        {balance.toFixed(6)} <b>({(balance * cryptoPrices[coin]).toFixed(2)} USD)</b>
                      </p>
                    </div>
                    <span
                      style={{
                        color: percentageChange > 0 ? "#16C784" : percentageChange < 0 ? "#ea3943" : "#ffffff75",
                        fontWeight: "bold",
                        marginLeft: "10px",
                      }}>
                      {percentageChange.toFixed(2)}%
                    </span>
                    <button onClick={() => sellCrypto(coin)} disabled={balance <= 0} className="sell-btn">
                      Sell All
                    </button>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <button onClick={() => investInCrypto(coin, totalUSD / 2)} disabled={totalUSD < 1} className="invest-btn">
                        Invest Half (${(totalUSD / 2).toFixed(2)})
                      </button>
                      <button onClick={() => investInCrypto(coin, totalUSD)} disabled={totalUSD <= 0} className="invest-btn">
                        Invest All
                      </button>
                    </div>
                  </span>
                );
              })}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
