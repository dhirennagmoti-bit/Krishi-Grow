package com.agri.platform.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "buyer_profiles")
public class BuyerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(name = "buyer_type", nullable = false)
    private String buyerType;

    @Column(name = "gst_number")
    private String gstNumber;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String state;
    private String district;
    private String taluka;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "verification_status")
    private String verificationStatus = "PENDING";

    public BuyerProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getBuyerType() { return buyerType; }
    public void setBuyerType(String buyerType) { this.buyerType = buyerType; }

    public String getGstNumber() { return gstNumber; }
    public void setGstNumber(String gstNumber) { this.gstNumber = gstNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getTaluka() { return taluka; }
    public void setTaluka(String taluka) { this.taluka = taluka; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public static BuyerProfileBuilder builder() { return new BuyerProfileBuilder(); }

    public static class BuyerProfileBuilder {
        private Long id;
        private User user;
        private String businessName;
        private String buyerType;
        private String gstNumber;
        private String address;
        private String state;
        private String district;
        private String taluka;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String verificationStatus = "PENDING";

        public BuyerProfileBuilder id(Long id) { this.id = id; return this; }
        public BuyerProfileBuilder user(User user) { this.user = user; return this; }
        public BuyerProfileBuilder businessName(String businessName) { this.businessName = businessName; return this; }
        public BuyerProfileBuilder buyerType(String buyerType) { this.buyerType = buyerType; return this; }
        public BuyerProfileBuilder gstNumber(String gstNumber) { this.gstNumber = gstNumber; return this; }
        public BuyerProfileBuilder address(String address) { this.address = address; return this; }
        public BuyerProfileBuilder state(String state) { this.state = state; return this; }
        public BuyerProfileBuilder district(String district) { this.district = district; return this; }
        public BuyerProfileBuilder taluka(String taluka) { this.taluka = taluka; return this; }
        public BuyerProfileBuilder latitude(BigDecimal latitude) { this.latitude = latitude; return this; }
        public BuyerProfileBuilder longitude(BigDecimal longitude) { this.longitude = longitude; return this; }
        public BuyerProfileBuilder verificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; return this; }

        public BuyerProfile build() {
            BuyerProfile bp = new BuyerProfile();
            bp.setId(id);
            bp.setUser(user);
            bp.setBusinessName(businessName);
            bp.setBuyerType(buyerType);
            bp.setGstNumber(gstNumber);
            bp.setAddress(address);
            bp.setState(state);
            bp.setDistrict(district);
            bp.setTaluka(taluka);
            bp.setLatitude(latitude);
            bp.setLongitude(longitude);
            bp.setVerificationStatus(verificationStatus);
            return bp;
        }
    }
}
