package com.agri.platform.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "farmer_profiles")
public class FarmerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "farm_size")
    private BigDecimal farmSize;

    private String state;
    private String district;
    private String taluka;
    private String village;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "location_privacy")
    private String locationPrivacy = "APPROXIMATE";

    @Column(name = "verification_status")
    private String verificationStatus = "PENDING";

    public FarmerProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BigDecimal getFarmSize() { return farmSize; }
    public void setFarmSize(BigDecimal farmSize) { this.farmSize = farmSize; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getTaluka() { return taluka; }
    public void setTaluka(String taluka) { this.taluka = taluka; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getLocationPrivacy() { return locationPrivacy; }
    public void setLocationPrivacy(String locationPrivacy) { this.locationPrivacy = locationPrivacy; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public static FarmerProfileBuilder builder() { return new FarmerProfileBuilder(); }

    public static class FarmerProfileBuilder {
        private Long id;
        private User user;
        private BigDecimal farmSize;
        private String state;
        private String district;
        private String taluka;
        private String village;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String locationPrivacy = "APPROXIMATE";
        private String verificationStatus = "PENDING";

        public FarmerProfileBuilder id(Long id) { this.id = id; return this; }
        public FarmerProfileBuilder user(User user) { this.user = user; return this; }
        public FarmerProfileBuilder farmSize(BigDecimal farmSize) { this.farmSize = farmSize; return this; }
        public FarmerProfileBuilder state(String state) { this.state = state; return this; }
        public FarmerProfileBuilder district(String district) { this.district = district; return this; }
        public FarmerProfileBuilder taluka(String taluka) { this.taluka = taluka; return this; }
        public FarmerProfileBuilder village(String village) { this.village = village; return this; }
        public FarmerProfileBuilder latitude(BigDecimal latitude) { this.latitude = latitude; return this; }
        public FarmerProfileBuilder longitude(BigDecimal longitude) { this.longitude = longitude; return this; }
        public FarmerProfileBuilder locationPrivacy(String locationPrivacy) { this.locationPrivacy = locationPrivacy; return this; }
        public FarmerProfileBuilder verificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; return this; }

        public FarmerProfile build() {
            FarmerProfile fp = new FarmerProfile();
            fp.setId(id);
            fp.setUser(user);
            fp.setFarmSize(farmSize);
            fp.setState(state);
            fp.setDistrict(district);
            fp.setTaluka(taluka);
            fp.setVillage(village);
            fp.setLatitude(latitude);
            fp.setLongitude(longitude);
            fp.setLocationPrivacy(locationPrivacy);
            fp.setVerificationStatus(verificationStatus);
            return fp;
        }
    }
}
