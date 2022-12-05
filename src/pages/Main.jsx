import React, { useState, useEffect } from "react";
import { useWallet } from "use-wallet";

import { useBlockchainContext } from "../context";
import { Toast } from "../utils/message";
import logo from "../assets/images/logo.png";
import sub1 from "../assets/images/first.png";
import sub2 from "../assets/images/second.png";
import sub3 from "../assets/images/third.png";

export default function Main() {
    const wallet = useWallet();
    const [state, { BuyToken, getTotal }] = useBlockchainContext();
    // var styledAddress = wallet.account
    //     ? wallet.account.slice(0, 4) + "..." + wallet.account.slice(-4)
    //     : "";
    const [flag, setFlag] = useState(1);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [percent, setPercent] = useState(0);
    const [restTime, setRestTime] = useState(null);

    useEffect(() => {
        if (!state.terms)
            setRestTime({
                day: 0,
                hour: 0,
                min: 0,
                sec: 0,
            });
        else {
            setRestTime({
                day: Math.floor(state.terms.duration / (24 * 3600)),
                hour: Math.floor(
                    (state.terms.duration -
                        Math.floor(state.terms.duration / (24 * 3600)) *
                            3600 *
                            24) /
                        3600
                ),
                min: Math.floor(
                    (state.terms.duration -
                        Math.floor(state.terms.duration / 3600) * 3600) /
                        60
                ),
                sec: Math.floor(
                    state.terms.duration -
                        (Math.floor(state.terms.duration / 3600) * 3600 +
                            Math.floor(
                                Math.floor(
                                    (state.terms.duration -
                                        Math.floor(
                                            state.terms.duration / 3600
                                        ) *
                                            3600) /
                                        60
                                ) * 60
                            ))
                ),
            });
        }
    }, [state.terms]);

    useEffect(() => {
        if (amount > 0) {
            Number(flag) === 1
                ? setTokenAmount((amount * state.BNBPrice) / state.price)
                : setTokenAmount(amount / state.price);
        } else {
            setTokenAmount(0);
        }
    }, [flag, amount]);

    useEffect(() => {
        if (state.totalSold !== null) {
            setPercent(
                Number((state.totalSold / state.totalAmount) * 100).toFixed(2)
            );
        } else {
            setPercent(0);
        }
    }, [state.totalSold]);

    const handleConnect = () => {
        wallet.connect();
    };

    const handleBuy = () => {
        if (amount.toString().trim() === "" || amount <= 0) {
            Toast("Please input amount", "warning");
            return;
        }
        if (Number(wallet.chainId) !== state.supportChainId) {
            Toast("Please use Smart Chain", "warning");
            return;
        }
        setLoading(true);
        BuyToken({
            flag: flag,
            amount: amount,
        })
            .then((res) => {
                if (res) {
                    Toast("Successfully Buy", "success");
                    getTotal();
                } else {
                    Toast("Buy Failed", "error");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                Toast("Buy Failed", "error");
            });
    };

    const onChangeAmount = (e) => {
        setAmount(e.target.value);
    };

    const addToken = async () => {
        if (wallet.status !== "connected") {
            Toast("Please connect wallet", "warning");
            return;
        }

        let tokenAddress = "0x5bb73c1df811114b8482F4d25f1B71b25459C924";
        let tokenSymbol = "TFI";
        let tokenDecimals = 18;
        let tokenImage = "https://i.imgur.com/EYTTZLG.png";

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20", // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        image: tokenImage, // A string url of the token logo
                    },
                },
            });
        } catch (error) {
            console.log(error);
            Toast("Failed token add", "error");
        }
    };

    return (
        <div className="dashboard">
            <div className="spacer-half"></div>

            {/* Begin Header */}
            <div className="container">
                <a href="https://www.tradefiswap.com/">
                    <div className="header">
                        <img src={logo} alt="" />
                        <h3>Tradefi</h3>
                    </div>
                </a>
            </div>
            {/* End Header */}

            <div className="spacer-half"></div>

            {/* Begin Mainboard */}
            <section className="mainboard">
                <div className="container">
                    <div className="flex center middle text-center">
                        <h2>Tradefi Presale</h2>
                    </div>

                    {/* Begin Presale Card */}
                    <div className="card">
                        <div className="presale__panel">
                            <h4>
                                {state.terms
                                    ? state.terms.status
                                    : "Presale starts in"}
                            </h4>

                            <div className="row time">
                                <div className="col-3">
                                    <span>
                                        {restTime === null
                                            ? null
                                            : restTime.day > 9
                                            ? restTime.day
                                            : "0" + restTime.day}
                                    </span>
                                </div>
                                <div className="col-3">
                                    <span>
                                        {restTime === null
                                            ? null
                                            : restTime.hour > 9
                                            ? restTime.hour
                                            : "0" + restTime.hour}
                                    </span>
                                </div>
                                <div className="col-3">
                                    <span>
                                        {restTime === null
                                            ? null
                                            : restTime.min > 9
                                            ? restTime.min
                                            : "0" + restTime.min}
                                    </span>
                                </div>
                                <div className="col-3">
                                    <span>
                                        {restTime === null
                                            ? null
                                            : restTime.sec > 9
                                            ? restTime.sec
                                            : "0" + restTime.sec}
                                    </span>
                                </div>
                            </div>
                            <div className="spacer-half"></div>

                            <div className="presale__content">
                                <div className="row">
                                    <div className="col-sm-4 col-xs-12">
                                        <span>Symbol: TFI</span>
                                    </div>
                                    <div className="col-sm-4 col-xs-12">
                                        <span>Price: {state.price}</span>
                                    </div>
                                    <div className="col-sm-4 col-xs-12">
                                        <span onClick={addToken}>
                                            <b>Add to Metamask</b>
                                        </span>
                                    </div>
                                </div>
                                <div className="spacer-10"></div>

                                <div className="slider">
                                    {/* <span>
                                        Sold Amount (
                                        {Number(state.totalSold).toFixed(2)} $)
                                    </span> */}
                                    {/* <div className="bar">
                                        <div
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div> */}
                                    {/* <div className="spacer-10"></div> */}
                                    {/* <div className="status_bar">
                                        <div>
                                            <span>softcap (300K $)</span>
                                        </div>
                                        <div>
                                            <span>hardcap (700K $)</span>
                                        </div>
                                    </div> */}
                                    <div className="spacer-double"></div>

                                    <div className="presale__control">
                                        <label>Select: </label>
                                        <select
                                            onChange={(e) =>
                                                setFlag(e.target.value)
                                            }
                                        >
                                            <option value={1}>ETH</option>
                                            <option value={2}>USDC</option>
                                        </select>
                                    </div>
                                    <br />
                                    <div className="presale__control">
                                        <label>Amount: </label>
                                        <input
                                            type="number"
                                            onChange={(e) => onChangeAmount(e)}
                                        />
                                    </div>
                                    <br />
                                    {wallet.status === "connected" ? (
                                        <div className="presale__control">
                                            <label>Token Amount: </label>
                                            <span className="color">
                                                {state.price === null ||
                                                state.BNBPrice === null
                                                    ? "updating..."
                                                    : tokenAmount}
                                            </span>
                                        </div>
                                    ) : null}
                                    <div className="spacer-single"></div>

                                    <div className="flex middle center">
                                        {wallet.status === "connecting" ? (
                                            <button className="button-white">
                                                Connecting...
                                            </button>
                                        ) : wallet.status === "connected" ? (
                                            loading ? (
                                                <button className="button-white">
                                                    Buying...
                                                </button>
                                            ) : (
                                                <button
                                                    className="button-white"
                                                    onClick={handleBuy}
                                                >
                                                    Buy TFI Now
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                className="button-white"
                                                onClick={handleConnect}
                                            >
                                                Wallet Connect
                                            </button>
                                        )}
                                    </div>
                                    <div className="spacer-half"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Presale Card */}
                </div>
                <div className="spacer-double"></div>

                {/* Begin Ecosystem Info */}
                <div className="ecosystem">
                    <h2>What makes us different?</h2>
                    <div className="row text-center">
                        <div className="col-md-4 col-sm-12">
                            <span>
                                <img src={sub1} alt="" />
                                <h4>200x leverage</h4>
                                <p>
                                    Unlike most of our competitors that offer only up to 50x leverage,tradefi allows its users to use up to 200x leverage on various crypto pairs. Leverage is a potent tool in the right hands but can also be extremely risky. We only recommend its use for experienced traders. You can check our beta version here:{" "}
                                    <a href="https://app.tradefiswap.com/#/trade">
                                        Tradefiswap
                                    </a>
                                    .
                                </p>
                            </span>
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <span>
                                <img src={sub2} alt="" />
                                <h4>
                                    Wide variety of assets
                                </h4>
                                <p>
                                    We have revolutionized the idea of trading with crypto. Up until now, trading in crypto has been a very narrow street.Little to no options apart from trading with low leverage other cryptocurrencys or depositing on a CEX for a wider variety of assets at the cost of losing anonymity. Here is where tradefi steps in as a pioneer of decentralized trading. We offer stocks,forex and crypto futures/options trading all of witch can be done from your browser wallet in a decentralized way. See the following link for more details {" "}
                                    <a href="https://tradefi.gitbook.io/tradefi-the-future-of-trading/features/crypto-trading">
                                        TradefiDocs
                                    </a>{" "}.
                                    You can also check out our beta crypto options trading platform :
                                    {" "}
                                    <a href="https://options.tradefiswap.com/">
                                        Tradefi Options.
                                    </a>
                                </p>
                            </span>
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <span>
                                <img src={sub3} alt="" />
                                <h4>
                                    Decentralized Funded accounts
                                </h4>
                                <p>
                                Our end goal is to create a Decentralized prop firm where users will be able to trade crypto, stocks and forex with up to 150k funded money all while maintaining users identity private. Although prop firms aren't a new concept in the broader financial system, they are definitely in their infant stage in crypto. Interested in knowing more? Check out our docs{" "}
                                    <a href="https://tradefi.gitbook.io/tradefi-the-future-of-trading/features/decentralized-funded-accounts-dfa">
                                        TradefiDecentralizedFundedAccounts
                                    </a>
                                    .
                                </p>
                            </span>
                        </div>
                    </div>
                </div>
                {/* End Ecosystem Info */}
            </section>
            {/* End Mainboard */}

            <div className="spacer-double"></div>

            {/* Begin Footer */}
            <section className="footer">
                <a href="https://www.tradefiswap.com/">
                    <div>
                        <img src={logo} alt="" />
                        <h3>TradefiSwap</h3>
                    </div>
                </a>
                <p>2022 &copy; TradeFi: 🌐Decentralization, transparency and community</p>
            </section>
            {/* End Footer */}
        </div>
    );
}
