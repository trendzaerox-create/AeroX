package com.mydev.ecommerce.giftbox.repository;

import com.mydev.ecommerce.giftbox.model.GiftBox;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GiftBoxRepository extends JpaRepository<GiftBox, Long> {

    List<GiftBox> findByActiveTrueAndDeletedFalseOrderByIdAsc();

    List<GiftBox> findByDeletedFalseOrderByIdDesc();

    Optional<GiftBox> findByIdAndDeletedFalse(Long id);
}