import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import CryptoLineChart from "./CryptoLineChart";
import USDLineChart from "./USDLineChart";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnimatedNumber from "./AnimatedNumber";

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

  const [pendingPosts, setPendingPosts] = useState([]);

  const [releasedCoins, setReleasedCoins] = useState([{ name: "Galaxy Token", logo: "https://via.placeholder.com/40", supply: 1000000 }]);

  const [coinMarketData, setCoinMarketData] = useState({});

  const [usdHistory, setUsdHistory] = useState([]);
  const [investedHistory, setInvestedHistory] = useState([]); // ✅ Track investment history

  // State for news events
  const [newsEvent, setNewsEvent] = useState({ message: null, effect: {} });
  const [visible, setVisible] = useState(false);
  const [posts, setPosts] = useState([]);

  const [newCoin, setNewCoin] = useState({
    name: "",
    logo: "",
    supply: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoin((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCoin((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const releaseCoin = () => {
    if (!newCoin.name || !newCoin.logo || !newCoin.supply) {
      alert("Please fill in all fields.");
      return;
    }

    const coinName = newCoin.name.trim();
    if (releasedCoins.some((coin) => coin.name === coinName)) {
      alert("This coin already exists!");
      return;
    }

    // Set initial price & market data
    const initialPrice = Math.random() * 0.05 + 0.01;
    setReleasedCoins((prev) => [...prev, newCoin]);
    setCoinMarketData((prev) => ({
      ...prev,
      [coinName]: { price: initialPrice, supply: Number(newCoin.supply), marketCap: initialPrice * Number(newCoin.supply) },
    }));

    // ✅ Add the new coin post to pendingPosts
    setPendingPosts((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "CryptoNews",
        profilePic: "/images/news-avatar.png",
        message: `🚀 "${coinName}" has just launched! Will it take over the crypto market?`,
        likes: Math.floor(Math.random() * 500 + 100),
        coinEffect: coinName,
        priceImpact: [0.1, 0.3], // Boost price for hype
      },
    ]);

    // Reset form
    setNewCoin({ name: "", logo: "", supply: "" });
  };

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

          // Limit the array to the last 20 data points
          if (updatedHistory[coin].length > 10) {
            updatedHistory[coin] = updatedHistory[coin].slice(-10);
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
      let newPost;

      if (pendingPosts.length > 0) {
        // ✅ If there's a pending user-created post, use that
        newPost = pendingPosts[0];
        setPendingPosts((prev) => prev.slice(1)); // Remove from queue after posting
      } else {
        // ✅ Otherwise, pick a random post
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

        newPost = {
          id: Date.now(),
          name: randomPost.name,
          profilePic: randomPost.profilePic,
          message: randomPost.message,
          likes: Math.floor(Math.random() * 5000) + 1,
          coinEffect: randomPost.coinEffect,
          priceImpact,
        };
      }

      setPosts((prevPosts) => [newPost, ...prevPosts.slice(0, 7)]); // Keep latest 8 posts

      // ✅ Update coin prices
      setCryptoPrices((prevPrices) => {
        const newPrices = { ...prevPrices };
        if (newPrices[newPost.coinEffect]) {
          newPrices[newPost.coinEffect] = Math.max(newPrices[newPost.coinEffect] + newPrices[newPost.coinEffect] * newPost.priceImpact, 0.01);
        }
        return newPrices;
      });
    }, 25000); // Runs every 25 seconds

    return () => clearInterval(socialInterval);
  }, [pendingPosts]); // ✅ Depend on pendingPosts so new coins get posted

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
    const balanceToSell = cryptoBalances[coin]; // ✅ Get balance before updating state
    if (balanceToSell <= 0) return; // ✅ Prevent selling if no balance

    const usdValue = balanceToSell * cryptoPrices[coin]; // ✅ Convert crypto to USD

    setCryptoBalances((prevBalances) => ({
      ...prevBalances,
      [coin]: 0, // ✅ Reset balance for this coin
    }));

    setInitialInvestments((prevInvestments) => ({
      ...prevInvestments,
      [coin]: 0, // ✅ Reset investment tracking
    }));

    setTotalUSD((prevUSD) => prevUSD + usdValue); // ✅ Correct USD update

    // ✅ Recalculate total invested across all remaining crypto
    const newTotalInvested = Object.entries(cryptoBalances)
      .filter(([key]) => key !== coin) // Exclude the sold coin
      .reduce((sum, [key, balance]) => sum + balance * cryptoPrices[key], 0);

    setUsdHistory((prevHistory = []) => [
      ...prevHistory.slice(-30),
      { time: Date.now(), usd: totalUSD + newTotalInvested }, // ✅ Ensure total includes cash + investments
    ]);

    setInvestedHistory((prevHistory = []) => [
      ...prevHistory.slice(-30),
      { time: Date.now(), invested: newTotalInvested > 0 ? newTotalInvested : totalUSD }, // ✅ Prevent drop to zero
    ]);

    // ✅ Ensure notification runs once after state updates
    showNotification(`Sold ${coin} for $${usdValue.toFixed(2)}`, "info");
  };

  const investInCrypto = (coin, amount) => {
    const amountNum = parseFloat(amount); // Ensure the input is a number

    if (isNaN(amountNum) || amountNum <= 0 || amountNum > totalUSD) {
      toast.error("Invalid amount! Enter a value greater than 0 and within your available balance.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
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

    // ✅ Show a success notification
    toast.success(`Invested $${amountNum.toFixed(2)} in ${coin}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  // ✅ Calculate total invested value
  const totalInvested = Object.entries(cryptoBalances).reduce((acc, [coin, balance]) => acc + balance * cryptoPrices[coin], 0);

  useEffect(() => {
    const totalCryptoValue = Object.entries(cryptoBalances).reduce((sum, [coin, balance]) => {
      return sum + balance * cryptoPrices[coin]; // ✅ Convert all balances to USD
    }, 0);

    const totalNetWorth = totalUSD + totalCryptoValue; // ✅ Always track total USD + investments

    setUsdHistory((prevHistory = []) => [
      ...prevHistory.slice(-30),
      { time: Date.now(), usd: totalNetWorth }, // ✅ Use total wealth instead of just USD
    ]);

    setInvestedHistory((prevHistory = []) => [
      ...prevHistory.slice(-30),
      { time: Date.now(), invested: totalCryptoValue > 0 ? totalCryptoValue : totalUSD }, // ✅ Prevents drop to zero
    ]);
  }, [totalUSD, cryptoBalances, cryptoPrices]); // ✅ Depend on crypto values

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

  const showNotification = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 2000, // ✅ Closes after 3 seconds
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  useEffect(() => {
    const priceUpdateInterval = setInterval(() => {
      setCoinMarketData((prevData) => {
        const updatedData = { ...prevData };

        Object.keys(updatedData).forEach((coin) => {
          const changePercent = (Math.random() * 6 - 3) / 100; // Simulate -3% to +3% fluctuation
          const newPrice = Math.max(updatedData[coin].price + updatedData[coin].price * changePercent, 0.001);

          updatedData[coin].price = newPrice;
          updatedData[coin].marketCap = newPrice * updatedData[coin].supply;
        });

        return updatedData;
      });
    }, 1000); // Update every 5 seconds

    return () => clearInterval(priceUpdateInterval);
  }, [releasedCoins]);

  const sellReleasedCoin = (coinName) => {
    if (!coinMarketData[coinName]) return;

    const { price, supply } = coinMarketData[coinName];
    const marketCap = price * supply; // ✅ Get the latest fluctuating market cap
    const earnings = marketCap * 0.01; // ✅ Use fluctuating price for sell value

    setTotalUSD((prevUSD) => prevUSD + earnings); // ✅ Add money to totalUSD

    setReleasedCoins((prev) => prev.filter((coin) => coin.name !== coinName)); // ✅ Remove from UI

    setCoinMarketData((prevData) => {
      const newData = { ...prevData };
      delete newData[coinName]; // ✅ Remove from market data
      return newData;
    });
  };

  return (
    <div className="App">
      <ToastContainer />
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
                    {/* <img src={post.image} alt={post.image} className="post-pic" /> */}
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
                  <AnimatedNumber value={totalUSD + totalInvested} />
                </h2>
                <div style={{ marginTop: "40px" }}>
                  <USDLineChart usdHistory={investedHistory} />
                </div>
              </div>
              {Object.entries(cryptoBalances).map(([coin, balance]) => {
                const percentageChange = getPercentageChange(coin);
                const currentPrice = cryptoPrices[coin]; // Get the current price of the coin

                const prevPrice = prevPricesRef.current[coin];
                const isPriceUp = currentPrice >= prevPrice;
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
                      {isPriceUp ? <span className="arrow-up"></span> : <span className="arrow-down"></span>}
                      <p
                        key={coin}
                        style={{
                          color: isPriceUp > 0 ? "#16C784" : "#ea3943",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}>
                        ${currentPrice.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ display: "flex" }}>
                      <p>
                        {balance.toFixed(6)} <b>({(balance * cryptoPrices[coin]).toFixed(2)} USD)</b>
                      </p>
                      {/* {cryptoPriceHistory[coin] && <CryptoLineChart key={coin} coin={coin} priceHistory={cryptoPriceHistory[coin]} />} */}
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
              {releasedCoins.map((coin, index) => {
                const marketData = coinMarketData[coin.name];
                if (!marketData) return null;

                const { price, supply } = marketData;
                const marketCap = price * supply;
                const sellValue = marketCap * 0.01;

                // Get previous price to determine up/down arrow
                const prevPrice = prevPricesRef.current[coin.name] || price;
                const isPriceUp = price >= prevPrice;

                return (
                  <span key={index} className="coin-balance">
                    <div style={{ display: "flex", gap: "10px", width: "128px", alignItems: "center" }}>
                      <img
                        src={coin.logo}
                        alt={coin.name}
                        style={{
                          width: "44px",
                          height: "48px",
                        }}
                        className="comp"
                      />
                      <p style={{ fontWeight: "600" }}>{coin.name}</p>
                      {isPriceUp ? <span className="arrow-up"></span> : <span className="arrow-down"></span>}
                      <p
                        style={{
                          color: isPriceUp ? "#16C784" : "#ea3943",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}>
                        ${price.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ display: "flex" }}>
                      <p>
                        {supply.toFixed(2)} <b>({marketCap.toFixed(2)} USD)</b>
                      </p>
                      {/* Add chart if available */}
                      {/* {cryptoPriceHistory[coin.name] && (
                        <CryptoLineChart key={coin.name} coin={coin.name} priceHistory={cryptoPriceHistory[coin.name]} />
                      )} */}
                    </div>
                    <span>
                      Market Cap: ${marketCap.toFixed(2)}
                    </span>
                    <p style={{ color: "#16C784", fontWeight: "bold" }}>
                      Sell Value: ${sellValue.toFixed(2)}
                    </p>
                    <button onClick={() => sellReleasedCoin(coin.name)} className="sell-btn">
                      Sell Coin
                    </button>
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
