package com.hostelhub.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room extends BaseEntity {

    @Column(nullable = false, length = 20)
    private String roomNumber;

    @Column(nullable = false)
    private Integer floorNumber;

    @Column(nullable = false)
    private Integer capacity;

    @Builder.Default
    @Column(nullable = false)
    private Integer occupiedBeds = 0;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isAvailable = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "hostel_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_room_hostel")
    )
    private Hostel hostel;
}