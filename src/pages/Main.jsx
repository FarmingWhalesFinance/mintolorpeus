import React, { useState, useEffect } from "react";
import { useWallet } from "use-wallet2";

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

        let tokenAddress = "0x5e6F1b30e5820C69E8aD125a5C89089093188691";
        let tokenSymbol = "GXP";
        let tokenDecimals = 18;
        let tokenImage = "https://i.imgur.com/NrT2JUw.png";

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
                <a href="https://www.gxpprotocol.com/">
                    <div className="header">
                        <img src={logo} alt="" />
                        <h3>Galaxy Protocol</h3>
                    </div>
                </a>
            </div>
            {/* End Header */}

            <div className="spacer-half"></div>

            {/* Begin Mainboard */}
            <section className="mainboard">
                <div className="container">
                  {/*   <div className="flex center middle text-center">
                        <h2>$GXP INITIAL MINT</h2>
                    </div> */}

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
                                        <span>Symbol: GXP</span>
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
                                            <option value={2}>DAI</option>
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
                                                    Mint GXP Now
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
                                <br></br>
                                <h4>Single-stake vaults</h4>
                                <p>
                                The Galaxy Protocol's single-stake vaults employ a strategy called pseudo-delta-neutrality, that allows users to earn profits from neutral positions, providing liquidity and being rewarded with the yields simultaneously. Know more about our GLP Delta-Neutral Hedging Strategy and our upcoming vaults  <a href="https://galaxy-protocol.gitbook.io/galaxy-protocol/discover-the-galaxy/glp-strategy">
                                        here
                                    </a>
                                    .
                                </p>
                            </span>
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <span>
                                <img src={sub3} alt="" />
                                <h4>
                                   Innovation & GXP's Future
                                </h4>
                                <p>
GXP is not just the yield optimizer and aggregator that offers the highest returns on Arbitrum (💙,🧡). There is a bright future ahead for the protocol: we plan to establish strategic partnerships with other key projects, introduce new yield aggregating strategies built on top of other products, integrate a fiat on-ramp solution & many more exciting features. Check out our   <a href="https://galaxy-protocol.gitbook.io/galaxy-protocol/discover-the-galaxy/roadmap">
                                    
                                         Roadmap
                                    </a>
                                    .
                                </p>
                            </span>
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <span>
                                <img src={sub2} alt="" />
                                <h4>
                                    Real Yield
                                </h4>
                                <p>
                                Stake our governance and utility token: $GXP, to earn platform revenue through our vaults and reserve. $GXP is designed to absorb the risk of single-staking vaults underperforming due to impermanent loss and also gain $GLP's profits from traders' losses. Learn more about how $GXP is created to profit from volatility even when executing a pseudo-Delta-Neutral Hedging Strategy:                                  <a href="https://galaxy-protocol.gitbook.io/galaxy-protocol/discover-the-galaxy/usdgxp/reserve">
                                        $GXP Reserve
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
                <a href="https://www.gxpprotocol.com/">
                    <div>
                        <img src={logo} alt="" />
                        <h3>Galaxy Protocol</h3>
                    </div>
                </a>
                <p>2022 &copy;🪐Galaxy Protocol</p>
            </section>
            {/* End Footer */}
        </div>
    );
}
